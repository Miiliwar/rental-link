import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthProfile } from '../context/AuthProfileContext';
import { isAdminUser } from '../utils/admin';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { user, loading } = useAuthProfile();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-600">
        {t('requireProfile.loading')}
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
