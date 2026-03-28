import type { User } from '@supabase/supabase-js';

/** Default demo admin when VITE_ADMIN_DEMO_EMAIL is unset (local hackathon only). */
const FALLBACK_ADMIN_EMAIL = 'admin@rentlink.demo';

export function getAdminDemoEmail(): string {
  const v = import.meta.env.VITE_ADMIN_DEMO_EMAIL?.trim();
  return v || FALLBACK_ADMIN_EMAIL;
}

export function isAdminUser(user: User | null | undefined): boolean {
  const email = user?.email?.trim().toLowerCase();
  if (!email) return false;
  return email === getAdminDemoEmail().toLowerCase();
}
