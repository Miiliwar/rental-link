import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RentLink</h3>
            <p className="text-gray-400">{t('footer.tagline')}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.aboutUs')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.howItWorks')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.trustSafety')}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.support')}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.helpCenter')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.contactUs')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  {t('footer.termsOfService')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright', { year })}</p>
        </div>
      </div>
    </footer>
  );
}
