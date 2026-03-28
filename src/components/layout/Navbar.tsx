import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, PackagePlus, UserCircle } from 'lucide-react';
import { useAuthProfile } from '../../context/AuthProfileContext';
import { isAdminUser } from '../../utils/admin';
import LanguageSwitcher from '../LanguageSwitcher';

export default function Navbar() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, profileComplete, signOut } = useAuthProfile();
  const showAdmin = user && isAdminUser(user);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-emerald-700 tracking-tight">
              RentLink
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link to="/" className="text-gray-700 hover:text-emerald-700 font-medium">
              {t('nav.home')}
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-emerald-700 font-medium">
              {t('nav.findRentals')}
            </Link>

            {!loading && user && (
              <>
                {showAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                  >
                    {t('nav.admin')}
                  </Link>
                )}
                <Link
                  to="/list"
                  className="text-gray-700 hover:text-emerald-700 font-medium inline-flex items-center gap-1"
                >
                  <PackagePlus className="w-4 h-4" />
                  {t('nav.listItem')}
                </Link>
                {!profileComplete && (
                  <Link
                    to="/account/complete?intent=lender"
                    className="text-amber-800 bg-amber-100 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-200"
                  >
                    {t('nav.completeProfile')}
                  </Link>
                )}
              </>
            )}

            <LanguageSwitcher className="inline-flex shrink-0" />

            <div className="flex items-center space-x-3 ml-2 pl-2 border-l border-gray-200">
              {!loading && !user && (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-emerald-700 font-medium">
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-800 transition"
                  >
                    {t('nav.register')}
                  </Link>
                </>
              )}
              {!loading && user && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 max-w-[140px] truncate" title={user.email}>
                    {user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="text-sm text-slate-600 hover:text-emerald-800 font-medium"
                  >
                    {t('nav.signOut')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            {!loading && user && (
              <Link
                to="/account/complete?intent=lender"
                className="p-2 text-emerald-700"
                aria-label={t('nav.accountAria')}
              >
                <UserCircle className="h-7 w-7" />
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-emerald-700 focus:outline-none p-1"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-1 shadow-lg absolute w-full z-50">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/search"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
          >
            {t('nav.findRentals')}
          </Link>
          {user && (
            <>
              {showAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  {t('nav.admin')}
                </Link>
              )}
              <Link
                to="/list"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
              >
                {t('nav.listItem')}
              </Link>
              {!profileComplete && (
                <Link
                  to="/account/complete?intent=lender"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-amber-900 bg-amber-50"
                >
                  {t('nav.completeProfileRequired')}
                </Link>
              )}
            </>
          )}
          <div className="border-t border-gray-100 pt-2 mt-2">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-emerald-700 hover:bg-emerald-50 mt-1"
                >
                  {t('nav.register')}
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-slate-50"
              >
                {t('nav.signOut')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
