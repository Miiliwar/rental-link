/** Turn Supabase / fetch failures into actionable UI copy */

export function formatAuthError(error: unknown): string {
  if (error == null) return 'Something went wrong. Please try again.';

  const raw =
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
      ? (error as { message: string }).message
      : error instanceof Error
        ? error.message
        : String(error);

  const m = raw.toLowerCase();

  if (
    raw === 'Failed to fetch' ||
    m.includes('failed to fetch') ||
    m.includes('networkerror') ||
    m.includes('network request failed') ||
    m.includes('load failed')
  ) {
    return [
      'Could not reach Supabase (network error).',
      '',
      'Check: internet connection, VPN/firewall, and that your project is active in the Supabase dashboard.',
      'Confirm `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (no quotes, no spaces).',
      'After changing `.env`, stop and restart `npm run dev`.',
    ].join(' ');
  }

  return raw;
}

export function hasSupabaseConfig(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      key &&
      typeof url === 'string' &&
      url.startsWith('https://') &&
      key.length > 20,
  );
}
