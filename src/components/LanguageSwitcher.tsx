import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', short: 'EN', native: 'English' },
  { code: 'am', short: 'አማ', native: 'አማርኛ' },
  { code: 'om', short: 'Oro', native: 'Afaan Oromoo' },
] as const;

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { i18n, t } = useTranslation();

  return (
    <label className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="sr-only">{t('nav.language')}</span>
      <select
        value={i18n.language.startsWith('am') ? 'am' : i18n.language.startsWith('om') ? 'om' : 'en'}
        onChange={(e) => void i18n.changeLanguage(e.target.value)}
        className="text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1.5 pr-7 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 cursor-pointer max-w-[140px] sm:max-w-none"
        aria-label={t('nav.language')}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.short} · {lang.native}
          </option>
        ))}
      </select>
    </label>
  );
}
