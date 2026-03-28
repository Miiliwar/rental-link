import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** Posting flow placeholder — profile is already enforced by the route guard. */
export default function ListItem() {
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">{t('listItem.title')}</h1>
      <p className="text-slate-600 mt-2">{t('listItem.body')}</p>
      <Link to="/" className="inline-block mt-6 text-emerald-700 font-medium hover:underline">
        {t('listItem.backHome')}
      </Link>
    </div>
  );
}
