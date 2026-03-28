import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  Search,
  ChevronRight,
  Star,
  Monitor,
  Shirt,
  Hammer,
  Sprout,
  BookOpen,
  MoreHorizontal,
  ChevronDown,
  Music,
  Bike,
  Car,
  Home as HomeIcon,
} from 'lucide-react';
import {
  ALL_CATEGORIES,
  MAIN_CATEGORIES,
  MORE_CATEGORIES,
  getItemsByCategory,
  type DemoItem,
} from '../data/demoItems';

const categoryIcons: Record<string, React.ReactNode> = {
  Electronics: <Monitor className="w-6 h-6" />,
  Clothes: <Shirt className="w-6 h-6" />,
  Construction: <Hammer className="w-6 h-6" />,
  Agriculture: <Sprout className="w-6 h-6" />,
  'Student materials': <BookOpen className="w-6 h-6" />,
  'Party & Events': <Music className="w-4 h-4 mr-3" />,
  'Sports & Outdoors': <Bike className="w-4 h-4 mr-3" />,
  Vehicles: <Car className="w-4 h-4 mr-3" />,
  Furniture: <HomeIcon className="w-4 h-4 mr-3" />,
};

function ItemCard({ item, t }: { item: DemoItem; t: TFunction }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 hover:border-emerald-200 hover:shadow-md transition duration-300 group flex flex-col h-full min-w-[220px] sm:min-w-0">
      <div className="relative h-48 mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-slate-100">
        <span className="absolute top-2 left-2 bg-white/95 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-md shadow-sm z-10 border border-slate-100">
          {t(`categories.${item.category}`)}
        </span>
        <img
          src={item.image}
          alt={item.title}
          className="max-h-full max-w-full object-cover w-full h-full group-hover:scale-[1.03] transition duration-300"
        />
      </div>

      <div className="flex-grow flex flex-col">
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-emerald-800 cursor-pointer">
          {item.title}
        </h3>

        <div className="flex items-center mb-3">
          <div className="flex text-amber-400 text-sm">
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current" />
            <Star className="w-4 h-4 fill-current text-slate-200" />
          </div>
          <span className="text-xs text-slate-500 ml-2">
            {t('home.itemReviews', { count: item.reviews })}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="text-xs text-slate-500 block">{t('home.dailyRate')}</span>
              <span className="text-lg font-bold text-emerald-700">
                ${item.price_per_day.toFixed(2)}
                <span className="text-sm text-slate-500 font-normal">{t('home.perDay')}</span>
              </span>
            </div>
            <div className="text-right min-w-0">
              <span className="text-xs text-slate-500 block">{t('home.securityDeposit')}</span>
              <span className="text-sm font-semibold text-slate-800">${item.full_item_price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const [heroQuery, setHeroQuery] = useState('');
  const navigate = useNavigate();

  const goToSearch = () => {
    navigate('/search', { state: { search: heroQuery.trim() || undefined } });
  };

  const categories = MAIN_CATEGORIES.map((name) => ({
    name,
    icon: categoryIcons[name] ?? <MoreHorizontal className="w-6 h-6" />,
  }));

  const moreCategories = MORE_CATEGORIES.map((name) => ({
    name,
    icon: categoryIcons[name] ?? <MoreHorizontal className="w-4 h-4 mr-3" />,
  }));

  return (
    <div className="flex flex-col items-center bg-slate-50 min-h-screen">
      <section className="w-full text-white relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 z-10">
            <span className="text-emerald-300/90 font-medium tracking-wide text-sm mb-4 block">
              {t('home.heroBadge')}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight text-white">
              {t('home.heroTitle1')}
              <br />
              <span className="text-emerald-300">{t('home.heroTitle2')}</span>
            </h1>
            <p className="text-lg mb-2 text-slate-300 max-w-xl">{t('home.heroSubtitle')}</p>
            <p className="text-sm text-slate-400 mb-8">{t('home.heroFinePrint')}</p>

            <div className="bg-white/95 p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg border border-white/20">
              <div className="flex-grow flex items-center pl-3 min-h-[44px]">
                <Search className="text-slate-400 h-5 w-5 mr-2 shrink-0" />
                <input
                  type="text"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && goToSearch()}
                  placeholder={t('home.searchPlaceholder')}
                  className="w-full py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>
              <button
                type="button"
                onClick={goToSearch}
                className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition shrink-0"
              >
                {t('home.findRentals')}
              </button>
            </div>
          </div>

          <div className="md:w-1/2 w-full relative z-10">
            <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&q=80&w=800"
                alt=""
                className="w-full max-h-[320px] md:max-h-[380px] object-cover opacity-95"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-4">
                <p className="text-sm text-white font-medium">{t('home.exampleCaption')}</p>
                <p className="text-xs text-slate-300">{t('home.exampleCaptionSub')}</p>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-slate-600/30 blur-3xl pointer-events-none" />
        </div>
      </section>

      <section className="w-full bg-white border-b border-slate-200/80 shadow-sm sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-center text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
            {t('home.browseByCategory')}
          </p>
          <div className="flex items-center justify-center py-2 flex-wrap gap-8 md:gap-12 relative">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to="/search"
                state={{ category: cat.name }}
                className="flex flex-col items-center min-w-[80px] cursor-pointer group no-underline text-inherit focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 rounded-xl"
              >
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition mb-2">
                  {cat.icon}
                </div>
                <span className="text-sm text-slate-700 font-medium whitespace-nowrap group-hover:text-emerald-800">
                  {t(`categories.${cat.name}`)}
                </span>
              </Link>
            ))}

            <div
              className="flex flex-col items-center min-w-[80px] cursor-pointer group relative"
              onMouseEnter={() => setIsMoreDropdownOpen(true)}
              onMouseLeave={() => setIsMoreDropdownOpen(false)}
              onClick={() => setIsMoreDropdownOpen(!isMoreDropdownOpen)}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition mb-2 ${
                  isMoreDropdownOpen
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800'
                }`}
              >
                <MoreHorizontal className="w-6 h-6" />
              </div>
              <span
                className={`text-sm font-medium whitespace-nowrap flex items-center ${
                  isMoreDropdownOpen ? 'text-emerald-800' : 'text-slate-700 group-hover:text-emerald-800'
                }`}
              >
                {t('home.more')} <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isMoreDropdownOpen ? 'rotate-180' : ''}`} />
              </span>

              {isMoreDropdownOpen && (
                <div className="absolute top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="py-2">
                    {moreCategories.map((cat) => (
                      <Link
                        key={cat.name}
                        to="/search"
                        state={{ category: cat.name }}
                        onClick={() => setIsMoreDropdownOpen(false)}
                        className="px-4 py-3 hover:bg-emerald-50 flex items-center text-slate-700 hover:text-emerald-800 transition cursor-pointer no-underline"
                      >
                        {cat.icon}
                        <span className="text-sm font-medium">{t(`categories.${cat.name}`)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex items-center justify-between hover:border-emerald-200 hover:shadow-sm transition">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">{t('home.depositTag')}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{t('home.depositTitle')}</h3>
              <p className="text-sm text-slate-600 mt-1">{t('home.depositDesc')}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 ml-3">
              <span className="text-2xl" aria-hidden>
                🛡️
              </span>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex items-center justify-between hover:border-emerald-200 hover:shadow-sm transition">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">{t('home.listTag')}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{t('home.listTitle')}</h3>
              <p className="text-sm text-slate-600 mt-1">{t('home.listDesc')}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 ml-3">
              <span className="text-2xl" aria-hidden>
                📦
              </span>
            </div>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 flex items-center justify-between hover:border-emerald-200 hover:shadow-sm transition">
            <div>
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">{t('home.trustTag')}</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{t('home.trustTitle')}</h3>
              <p className="text-sm text-slate-600 mt-1">{t('home.trustDesc')}</p>
            </div>
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0 ml-3">
              <span className="text-2xl" aria-hidden>
                🪪
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t('home.exploreTitle')}</h2>
            <p className="text-slate-500 mt-1 text-sm">{t('home.exploreSubtitle')}</p>
          </div>
          <Link
            to="/search"
            className="text-emerald-700 font-medium text-sm hover:text-emerald-800 inline-flex items-center gap-1"
          >
            {t('home.openCatalog')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {ALL_CATEGORIES.map((categoryName) => {
          const items = getItemsByCategory(categoryName);
          return (
            <div key={categoryName}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">{t(`categories.${categoryName}`)}</h3>
                <Link
                  to="/search"
                  state={{ category: categoryName }}
                  className="text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  {t('home.viewRentals')}
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible">
                {items.map((item) => (
                  <div key={item.id} className="snap-start shrink-0 w-[min(100%,260px)] md:w-auto">
                    <ItemCard item={item} t={t} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
