import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthProfile } from '../context/AuthProfileContext';

type Intent = 'lender' | 'renter';

export default function RequireCompleteProfile({
  children,
  intent,
}: {
  children: ReactNode;
  intent: Intent;
}) {
  const { t } = useTranslation();
  const { user, loading, profileComplete } = useAuthProfile();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-600">
        {t('requireProfile.loading')}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname, intent }} replace />;
  }

  if (!profileComplete) {
    return (
      <Navigate
        to={`/account/complete?intent=${intent}`}
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}
