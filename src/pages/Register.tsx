import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseClient';
import { Mail, Lock, User, AlertCircle, Building, CheckCircle2 } from 'lucide-react';

export default function Register() {
  const { t } = useTranslation();
  const [userType, setUserType] = useState<'individual' | 'company'>('individual');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          user_type: userType,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('register.successTitle')}</h2>
          <p className="text-gray-600 mb-4">{t('register.successBody')}</p>
          <p className="text-sm text-gray-500 mb-8">{t('register.successHint')}</p>
          <Link
            to="/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 transition"
          >
            {t('register.goToLogin')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{t('register.title')}</h2>
          <p className="text-gray-500 mt-2">{t('register.subtitle')}</p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
          <button
            type="button"
            onClick={() => setUserType('individual')}
            className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center transition ${
              userType === 'individual' ? 'bg-white shadow text-emerald-800' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-4 h-4 mr-2" /> {t('register.individual')}
          </button>
          <button
            type="button"
            onClick={() => setUserType('company')}
            className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center transition ${
              userType === 'company' ? 'bg-white shadow text-emerald-800' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building className="w-4 h-4 mr-2" /> {t('register.company')}
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {userType === 'company' ? t('register.companyName') : t('register.fullName')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {userType === 'company' ? (
                  <Building className="h-5 w-5 text-gray-400" />
                ) : (
                  <User className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                placeholder={userType === 'company' ? 'Acme Corp' : 'John Doe'}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('register.email')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('register.password')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{t('register.passwordHint')}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition mt-6"
          >
            {loading ? t('register.submitting') : t('register.submit')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {t('register.hasAccount')}{' '}
            <Link to="/login" className="font-medium text-emerald-700 hover:text-emerald-800">
              {t('register.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
