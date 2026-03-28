/** Required app_metadata / user_metadata fields for lenders & renters */

export const PROFILE_FIELD_LABELS = {
  full_name: 'Full name',
  phone: 'Phone number',
  location: 'Location (city / area)',
  fan_id: 'Fayda National ID (FAN)',
} as const;

/** Must match keys we persist in Supabase auth user_metadata */
export type ProfileMetadata = {
  full_name?: string;
  name?: string;
  phone?: string;
  location?: string;
  fan_id?: string;
  user_type?: 'individual' | 'company';
  company_name?: string;
  business_license?: string;
  profile_completed_at?: string;
};

export function getDisplayName(metadata: ProfileMetadata | undefined | null): string {
  if (!metadata) return '';
  const n = (metadata.full_name || metadata.name || '').trim();
  return n;
}

/** Both lenders and renters need the same core identity + contact info before using the platform. */
export function isProfileComplete(metadata: ProfileMetadata | undefined | null): boolean {
  if (!metadata) return false;
  const name = getDisplayName(metadata);
  if (!name) return false;
  const phone = (metadata.phone ?? '').trim();
  const location = (metadata.location ?? '').trim();
  const fan = (metadata.fan_id ?? '').trim();
  if (!phone || !location || !fan) return false;
  if (metadata.user_type === 'company') {
    const company = (metadata.company_name ?? '').trim();
    const license = (metadata.business_license ?? '').trim();
    if (!company || !license) return false;
  }
  return true;
}
