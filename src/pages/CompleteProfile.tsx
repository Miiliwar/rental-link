import { useState } from 'react';
import { Link, Navigate, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseClient';
import { useAuthProfile } from '../context/AuthProfileContext';
import { getDisplayName, type ProfileMetadata } from '../utils/profile';
import { formatAuthError, hasSupabaseConfig } from '../utils/authErrors';
import { AlertCircle, MapPin, Phone, CreditCard, Building2, FileText, User } from 'lucide-react';

export default function CompleteProfile() {
  const { t } = useTranslation();
  const { user, loading, profileComplete, metadata, refreshSession } = useAuthProfile();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const intent = searchParams.get('intent') as 'lender' | 'renter' | null;
  const redirectTo = (routeLocation.state as { from?: string } | null)?.from;

  const userType = (metadata.user_type as 'individual' | 'company' | undefined) ?? 'individual';

  const [fullName, setFullName] = useState(() => getDisplayName(metadata) || '');
  const [phone, setPhone] = useState(() => (metadata.phone ?? '').trim());
  const [address, setAddress] = useState(() => (metadata.location ?? '').trim());
  const [fanId, setFanId] = useState(() => (metadata.fan_id ?? '').trim());
  const [companyName, setCompanyName] = useState(() => (metadata.company_name ?? '').trim());
  const [businessLicense, setBusinessLicense] = useState(() => (metadata.business_license ?? '').trim());

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-600">
        {t('completeProfile.loading')}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/account/complete' }} replace />;
  }

  if (profileComplete) {
    return <Navigate to={redirectTo || '/'} replace />;
  }

  const headline =
    intent === 'lender'
      ? t('completeProfile.headlineLender')
      : intent === 'renter'
        ? t('completeProfile.headlineRenter')
        : t('completeProfile.headlineDefault');

  const sub =
    intent === 'lender'
      ? t('completeProfile.subLender')
      : intent === 'renter'
        ? t('completeProfile.subRenter')
        : t('completeProfile.subDefault');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload: ProfileMetadata = {
      full_name: fullName.trim(),
      phone: phone.trim(),
      location: address.trim(),
      fan_id: fanId.trim(),
      user_type: userType,
      profile_completed_at: new Date().toISOString(),
    };
    if (userType === 'company') {
      payload.company_name = companyName.trim();
      payload.business_license = businessLicense.trim();
    }

    if (!hasSupabaseConfig()) {
      setError(t('completeProfile.errorMissingConfig'));
      setSaving(false);
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setError(t('completeProfile.errorSession'));
      setSaving(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: payload,
      });

      if (updateError) {
        setError(formatAuthError(updateError));
        setSaving(false);
        return;
      }

      await refreshSession();
      setSaving(false);
      navigate(redirectTo || '/', { replace: true });
    } catch (err) {
      setError(formatAuthError(err));
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[80vh] bg-slate-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{headline}</h1>
          <p className="text-slate-600 mt-2 text-sm">{sub}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          {!hasSupabaseConfig() && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <strong className="font-semibold">{t('completeProfile.configStrong')}</strong>{' '}
              {t('completeProfile.configBody')}
            </div>
          )}
          {error && (
            <div className="mb-4 flex gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-800 whitespace-pre-wrap">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('completeProfile.fullName')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={t('completeProfile.placeholderName')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('completeProfile.phone')}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={t('completeProfile.placeholderPhone')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('completeProfile.location')}</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={t('completeProfile.placeholderLocation')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('completeProfile.fan')}</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  required
                  value={fanId}
                  onChange={(e) => setFanId(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={t('completeProfile.placeholderFan')}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">{t('completeProfile.fanHint')}</p>
            </div>

            {userType === 'company' && (
              <>
                <div className="border-t border-slate-100 pt-5">
                  <p className="text-sm font-medium text-slate-800 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> {t('completeProfile.companyDetails')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('completeProfile.companyName')}</label>
                  <input
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                    <FileText className="w-4 h-4" /> {t('completeProfile.businessLicense')}
                  </label>
                  <input
                    required
                    value={businessLicense}
                    onChange={(e) => setBusinessLicense(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={t('completeProfile.businessLicensePlaceholder')}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-800 disabled:opacity-50 transition"
            >
              {saving ? t('completeProfile.submitting') : t('completeProfile.submit')}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-4">
            <Link to="/" className="text-emerald-700 hover:underline">
              {t('completeProfile.backHome')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
