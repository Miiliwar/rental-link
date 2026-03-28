import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, Filter, Star, MapPin } from 'lucide-react';
import { useAuthProfile } from '../context/AuthProfileContext';
import { ALL_CATEGORIES, DEMO_ITEMS } from '../data/demoItems';

const categoryPills = ['All', ...ALL_CATEGORIES] as const;

type SearchLocationState = { category?: string; search?: string } | null;

function categoryPillLabel(category: string, t: (k: string) => string) {
  if (category === 'All') return t('search.all');
  return t(`categories.${category}`);
}

export default function Search() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, profileComplete } = useAuthProfile();
  const location = useLocation();
  const state = location.state as SearchLocationState;
  const navCategory = state?.category;
  const navSearch = state?.search;

  const initialCategory = useMemo(() => {
    if (navCategory && ALL_CATEGORIES.includes(navCategory as (typeof ALL_CATEGORIES)[number])) {
      return navCategory;
    }
    return 'All';
  }, [navCategory]);

  const [searchTerm, setSearchTerm] = useState(() => navSearch ?? '');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  useEffect(() => {
    if (navCategory && ALL_CATEGORIES.includes(navCategory as (typeof ALL_CATEGORIES)[number])) {
      setSelectedCategory(navCategory);
    }
  }, [navCategory]);

  useEffect(() => {
    if (navSearch !== undefined && navSearch !== null) {
      setSearchTerm(navSearch);
    }
  }, [navSearch]);

  const filteredItems = DEMO_ITEMS.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartRental = (itemId: number) => {
    if (!user) {
      navigate('/login', { state: { from: '/search', intent: 'renter' } });
      return;
    }
    if (!profileComplete) {
      navigate(
        { pathname: '/account/complete', search: '?intent=renter' },
        { state: { from: '/search' } },
      );
      return;
    }
    navigate({ pathname: '/rent', search: `?item=${itemId}` });
  };

  const resultsTitle =
    selectedCategory === 'All'
      ? t('search.resultsAll', { count: filteredItems.length })
      : t('search.resultsInCategory', {
          count: filteredItems.length,
          category: t(`categories.${selectedCategory}`),
        });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-slate-500 mb-4">
          {t('search.introBefore')}{' '}
          <span className="font-medium text-slate-700">{t('search.introPerDay')}</span>{' '}
          {t('search.introMiddle')}{' '}
          <span className="font-medium text-slate-700">{t('search.introDeposit')}</span>
          {t('search.introAfter')}
        </p>
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search.placeholder')}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50/80"
              />
            </div>
            <button
              type="button"
              className="bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-900 transition flex items-center justify-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              {t('search.refine')}
            </button>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-3 mt-6 pb-2">
            {categoryPills.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategory === category
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {categoryPillLabel(category, t)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">{t('search.filters')}</h3>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('search.dailyRentalRate')}</h4>
                <div className="space-y-2">
                  <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" /> {t('search.under20')}
                  </label>
                  <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" /> {t('search.range20_50')}
                  </label>
                  <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" /> {t('search.range50_100')}
                  </label>
                  <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" /> {t('search.over100')}
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('search.ownerType')}</h4>
                <div className="space-y-2">
                  <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" /> {t('search.individualP2P')}
                  </label>
                  <label className="flex items-center text-sm text-gray-600">
                    <input type="checkbox" className="rounded text-blue-600 mr-2" /> {t('search.companyB2C')}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow">
            <div className="mb-4 flex justify-between items-center flex-wrap gap-2">
              <h2 className="text-xl font-bold text-slate-900">{resultsTitle}</h2>
              <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>{t('search.sortRecommended')}</option>
                <option>{t('search.sortLowHigh')}</option>
                <option>{t('search.sortHighLow')}</option>
                <option>{t('search.sortRated')}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-md hover:border-emerald-200 transition duration-300 group flex flex-col"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <span className="absolute top-3 left-3 bg-white/95 text-slate-800 text-xs font-medium px-3 py-1 rounded-md z-10 shadow-sm border border-slate-100">
                      {t(`categories.${item.category}`)}
                    </span>
                    {item.owner_type === 'company' && (
                      <span
                        className="absolute top-3 right-3 bg-slate-800 text-white text-xs font-medium px-2 py-1 rounded-md z-10 shadow-sm"
                        title={t('search.businessLenderTitle')}
                      >
                        {t('search.business')}
                      </span>
                    )}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-emerald-800 transition">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium ml-1">{item.rating}</span>
                        <span className="text-gray-400 ml-1">
                          {t('search.reviewsShort', { count: item.reviews })}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.location}
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <div className="flex items-end justify-between gap-2 mb-3">
                        <div>
                          <span className="text-xs text-slate-500 block mb-1">{t('search.dailyRate')}</span>
                          <span className="text-xl font-bold text-emerald-700">
                            ${item.price_per_day.toFixed(2)}
                            <span className="text-sm text-slate-500 font-normal">{t('home.perDay')}</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-500 block mb-1">{t('search.deposit')}</span>
                          <span className="text-sm font-semibold text-slate-800">
                            ${item.full_item_price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartRental(item.id)}
                        className="w-full py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-semibold hover:bg-emerald-800 transition"
                      >
                        {t('search.startRental')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  <SearchIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <p className="text-lg font-medium text-slate-900">{t('search.noMatchTitle')}</p>
                  <p>{t('search.noMatchHint')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
