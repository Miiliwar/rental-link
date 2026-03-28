/**
 * Local M-Pesa Ethiopia (Safaricom) sandbox proxy.
 * Keeps consumer secret + passkey off the browser. Run: npm run mpesa-server
 *
 * Env: copy server/.env.example → server/.env
 */
import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const p = join(__dirname, '.env');
  if (!existsSync(p)) return;
  const raw = readFileSync(p, 'utf8');
  for (const line of raw.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnv();

const PORT = Number(process.env.MPESA_PORT || 8787);
const TOKEN_URL = 'https://apisandbox.safaricom.et/v1/token/generate?grant_type=client_credentials';
const STK_URL = 'https://apisandbox.safaricom.et/mpesa/stkpush/v3/processrequest';

const consumerKey = process.env.MPESA_CONSUMER_KEY || '';
const consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
const shortcode = process.env.MPESA_BUSINESS_SHORT_CODE || '';
const passkey = process.env.MPESA_PASSKEY || '';
/** If Ethiopia sandbox expects a fixed base64 Password from the portal, set this (overrides generation). */
const passwordBase64Override = process.env.MPESA_PASSWORD_BASE64 || '';

function pad2(n) {
  return String(n).padStart(2, '0');
}

function mpesaTimestamp() {
  const d = new Date();
  return (
    `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}` +
    `${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`
  );
}

function buildPassword() {
  if (passwordBase64Override) return passwordBase64Override;
  const ts = mpesaTimestamp();
  return Buffer.from(`${shortcode}${passkey}${ts}`, 'utf8').toString('base64');
}

async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`, 'utf8').toString('base64');
  const res = await fetch(TOKEN_URL, {
    method: 'GET',
    headers: { Authorization: `Basic ${auth}` },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Token failed ${res.status}: ${text}`);
  const data = JSON.parse(text);
  if (!data.access_token) throw new Error(`No access_token: ${text}`);
  return data.access_token;
}

function corsHeaders(origin) {
  const allow = origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ? origin : '*';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  const headers = { 'Content-Type': 'application/json; charset=utf-8', ...corsHeaders(origin) };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  const pathname = new URL(req.url || '/', 'http://127.0.0.1').pathname;
  if (req.method !== 'POST' || pathname !== '/stk-push') {
    res.writeHead(req.method === 'GET' && pathname === '/health' ? 200 : 404, headers);
    res.end(JSON.stringify(pathname === '/health' ? { ok: true } : { error: 'Not found' }));
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  let payload;
  try {
    payload = JSON.parse(body || '{}');
  } catch {
    res.writeHead(400, headers);
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  const { amount, phoneNumber, accountReference, transactionDesc } = payload;
  if (!consumerKey || !consumerSecret || !shortcode) {
    res.writeHead(503, headers);
    res.end(
      JSON.stringify({
        error: 'M-Pesa not configured. Set MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_BUSINESS_SHORT_CODE in server/.env',
      }),
    );
    return;
  }

  if (!passkey && !passwordBase64Override) {
    res.writeHead(503, headers);
    res.end(
      JSON.stringify({
        error: 'Set MPESA_PASSKEY or MPESA_PASSWORD_BASE64 in server/.env',
      }),
    );
    return;
  }

  const phone = String(phoneNumber || '').replace(/\D/g, '');
  if (!/^251\d{9}$/.test(phone)) {
    res.writeHead(400, headers);
    res.end(JSON.stringify({ error: 'Phone must be 12 digits starting with 251 (e.g. 2519XXXXXXXX)' }));
    return;
  }

  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt < 1) {
    res.writeHead(400, headers);
    res.end(JSON.stringify({ error: 'Amount must be a number ≥ 1' }));
    return;
  }

  const ts = mpesaTimestamp();
  const password = buildPassword();
  const merchantRequestId = `RentLink-${randomUUID()}`;

  const stkBody = {
    MerchantRequestID: merchantRequestId,
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: ts,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.round(amt),
    PartyA: phone,
    PartyB: shortcode,
    PhoneNumber: phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL || 'https://example.com/mpesa-callback',
    AccountReference: String(accountReference || 'RentLink').slice(0, 12),
    TransactionDesc: String(transactionDesc || 'Rental').slice(0, 13),
    ReferenceData: [{ Key: 'Order', Value: String(accountReference || 'RentLink').slice(0, 20) }],
  };

  try {
    const token = await getAccessToken();
    const stkRes = await fetch(STK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(stkBody),
    });
    const stkText = await stkRes.text();
    let stkJson;
    try {
      stkJson = JSON.parse(stkText);
    } catch {
      stkJson = { raw: stkText };
    }

    res.writeHead(stkRes.ok ? 200 : 502, headers);
    res.end(JSON.stringify({ ok: stkRes.ok, mpesa: stkJson }));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    res.writeHead(502, headers);
    res.end(JSON.stringify({ ok: false, error: msg }));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`M-Pesa proxy listening on http://127.0.0.1:${PORT} (POST /stk-push, GET /health)`);
});
