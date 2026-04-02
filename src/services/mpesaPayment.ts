/**
 * STK push is initiated via local proxy (server/mpesa-proxy.mjs) in dev.
 * Vite proxies /api/mpesa → http://127.0.0.1:8787
 *
 * Set VITE_MPESA_TEST_MODE=true to skip real API calls (UI + booking flow only).
 */
export function isMpesaTestMode(): boolean {
  return String(import.meta.env.VITE_MPESA_TEST_MODE).toLowerCase() === 'true';
}

export type StkPushPayload = {
  /** Whole ETB amount (integer, min 1) */
  amount: number;
  /** 251XXXXXXXXX */
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
};

export type StkPushResult =
  | { ok: true; data: unknown }
  | { ok: false; error: string; status?: number; data?: unknown };

/** Normalize Ethiopian mobile to 251XXXXXXXXX */
export function normalizeEthiopiaMsisdn(input: string): string | null {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('251')) return digits;
  if (digits.length === 10 && digits.startsWith('0')) return `251${digits.slice(1)}`;
  if (digits.length === 9) return `251${digits}`;
  return null;
}

export function usdToEtb(usd: number, etbPerUsd: number): number {
  return Math.max(1, Math.round(usd * etbPerUsd));
}

type StkProxyJson = { ok?: boolean; error?: string; mpesa?: unknown };

function parseProxyResponse(text: string, status: number): { ok: false; error: string; json?: StkProxyJson } | { ok: true; json: StkProxyJson } {
  const trimmed = text.trim();
  if (!trimmed) {
    const unreachable =
      status === 502 || status === 503 || status === 504 || status === 0;
    return {
      ok: false,
      error: unreachable
        ? 'Could not reach the M-Pesa proxy. Run: npm run mpesa-server (from the project root, with server/.env configured).'
        : `Empty response from server (${status}).`,
    };
  }
  try {
    return { ok: true, json: JSON.parse(trimmed) as StkProxyJson };
  } catch {
    return {
      ok: false,
      error:
        'Invalid response from server (not JSON). Ensure the M-Pesa proxy is running on port 8787.',
    };
  }
}

export async function requestStkPush(payload: StkPushPayload): Promise<StkPushResult> {
  const base = import.meta.env.VITE_MPESA_PROXY_BASE?.replace(/\/$/, '') ?? '';
  const url = `${base}/api/mpesa/stk-push`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    const parsed = parseProxyResponse(text, res.status);
    if (!parsed.ok) {
      return { ok: false, status: res.status, error: parsed.error };
    }
    const json = parsed.json;
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        error: typeof json.error === 'string' ? json.error : `Request failed (${res.status})`,
        data: json.mpesa,
      };
    }
    if (json.ok === false) {
      return { ok: false, error: typeof json.error === 'string' ? json.error : 'STK failed', data: json.mpesa };
    }
    return { ok: true, data: json.mpesa };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Network error';
    const isNetwork =
      msg === 'Failed to fetch' ||
      msg.includes('NetworkError') ||
      msg.includes('Load failed');
    return {
      ok: false,
      error: isNetwork
        ? 'Network error — is the dev server running and is npm run mpesa-server started?'
        : msg,
    };
  }
}

export function mpesaErrorMessage(mpesa: unknown): string {
  if (!mpesa || typeof mpesa !== 'object') return '';
  const o = mpesa as Record<string, unknown>;
  return String(
    o.ResponseDescription ?? o.CustomerMessage ?? o.errorMessage ?? o.error ?? '',
  ).trim();
}

/** Heuristic: Safaricom STK accepted (sandbox response shape may vary). */
export function isStkLikelyAccepted(mpesa: unknown): boolean {
  if (!mpesa || typeof mpesa !== 'object') return false;
  const o = mpesa as Record<string, unknown>;
  const code = o.ResponseCode ?? o.responseCode;
  if (code === '0' || code === 0) return true;
  if (o.CheckoutRequestID != null || o.checkoutRequestID != null) return true;
  const desc = String(o.ResponseDescription ?? o.CustomerMessage ?? '').toLowerCase();
  if (desc.includes('success') || desc.includes('accept')) return true;
  return false;
}

export function extractCheckoutRequestId(mpesa: unknown): string | undefined {
  if (!mpesa || typeof mpesa !== 'object') return undefined;
  const o = mpesa as Record<string, unknown>;
  const id = o.CheckoutRequestID ?? o.checkoutRequestID;
  return typeof id === 'string' && id.length > 0 ? id : undefined;
}
