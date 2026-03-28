import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseClient';
import { Mail, Lock, AlertCircle, Send } from 'lucide-react';

function isEmailNotConfirmedError(message: string, code?: string): boolean {
  const m = message.toLowerCase();
  if (code === 'email_not_confirmed') return true;
  return m.includes('email not confirmed') || m.includes('not confirmed');
}

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailUnconfirmed, setEmailUnconfirmed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEmailUnconfirmed(false);
    setResendMessage(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      if (isEmailNotConfirmedError(signInError.message, signInError.code)) {
        setEmailUnconfirmed(true);
        setError(t('login.emailUnconfirmedBody'));
      } else {
        setError(signInError.message);
      }
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setResendMessage(t('login.enterEmailFirst'));
      return;
    }
    setResendLoading(true);
    setResendMessage(null);
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    setResendLoading(false);
    if (resendError) {
      setResendMessage(resendError.message);
    } else {
      setResendMessage(t('login.resendCheckInbox'));
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{t('login.title')}</h2>
          <p className="text-gray-500 mt-2">{t('login.subtitle')}</p>
        </div>

        {error && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg flex flex-col gap-3 ${
              emailUnconfirmed
                ? 'bg-amber-50 border border-amber-200 text-amber-900'
                : 'bg-red-50 border border-red-200 text-red-600 flex-row items-start'
            }`}
          >
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
            {emailUnconfirmed && (
              <div className="pl-7 space-y-2">
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resendLoading}
                  className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-2 rounded-lg transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {resendLoading ? t('login.resendSending') : t('login.resendButton')}
                </button>
                {resendMessage && <p className="text-sm text-amber-800">{resendMessage}</p>}
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('login.email')}</label>
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">{t('login.password')}</label>
              <a href="#" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">
                {t('login.forgotPassword')}
              </a>
            </div>
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
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition"
          >
            {loading ? t('login.submitting') : t('login.submit')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {t('login.noAccount')}{' '}
            <Link to="/register" className="font-medium text-emerald-700 hover:text-emerald-800">
              {t('login.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
