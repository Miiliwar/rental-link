/**
 * STK push is initiated via local proxy (server/mpesa-proxy.mjs) in dev.
 * Vite proxies /api/mpesa → http://127.0.0.1:8787
 */

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

export async function requestStkPush(payload: StkPushPayload): Promise<StkPushResult> {
  const base = import.meta.env.VITE_MPESA_PROXY_BASE?.replace(/\/$/, '') ?? '';
  const url = `${base}/api/mpesa/stk-push`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string; mpesa?: unknown };
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
    return { ok: false, error: msg };
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
