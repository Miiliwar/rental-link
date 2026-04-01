/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  /** Optional: override M-Pesa proxy origin (default: same origin → Vite /api/mpesa) */
  readonly VITE_MPESA_PROXY_BASE?: string
  /** USD → ETB for STK amount (whole birr). Default 130 if unset. */
  readonly VITE_ETB_PER_USD?: string
  /** Email that may access /admin (demo). Default admin@rentlink.demo if unset. */
  readonly VITE_ADMIN_DEMO_EMAIL?: string
  /** If "true", M-Pesa STK is simulated in the browser (no proxy / Safaricom call). */
  readonly VITE_MPESA_TEST_MODE?: string
}
