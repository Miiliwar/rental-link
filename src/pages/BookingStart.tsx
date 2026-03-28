import { useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Bell,
  Calendar,
  Clock,
  MapPin,
  Shield,
  Smartphone,
  Star,
  CheckCircle2,
  MessageSquareWarning,
} from 'lucide-react';
import { getDemoItemById } from '../data/demoItems';
import {
  ReturnDeadlineCountdown,
  parseReturnDeadline,
} from '../components/rental/ReturnDeadlineCountdown';

const PLATFORM_FEE_RATE = 0.1;

function rentalDaysInclusive(startIso: string, endIso: string): number {
  const s = new Date(startIso + 'T12:00:00');
  const e = new Date(endIso + 'T12:00:00');
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 1;
  if (e < s) return 1;
  const diff = e.getTime() - s.getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.max(1, Math.ceil(diff / dayMs) + 1);
}

function defaultEndDate(start: string): string {
  const d = new Date(start + 'T12:00:00');
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

export default function BookingStart() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const stateItemId = (location.state as { itemId?: number } | null)?.itemId;
  const paramItem = searchParams.get('item');
  const itemId = stateItemId ?? (paramItem ? Number(paramItem) : undefined);

  const item = itemId != null ? getDemoItemById(itemId) : undefined;

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(() => defaultEndDate(today));
  const [returnTime, setReturnTime] = useState('18:00');
  const [paid, setPaid] = useState(false);

  const returnDeadline = useMemo(
    () => parseReturnDeadline(endDate, returnTime),
    [endDate, returnTime],
  );

  const days = useMemo(
    () => rentalDaysInclusive(startDate, endDate),
    [startDate, endDate],
  );

  const rentalSubtotal = item ? Math.round(days * item.price_per_day * 100) / 100 : 0;
  const platformFee = item ? Math.round(rentalSubtotal * PLATFORM_FEE_RATE * 100) / 100 : 0;
  const deposit = item?.full_item_price ?? 0;
  const totalDue = Math.round((rentalSubtotal + platformFee + deposit) * 100) / 100;

  const handleSimulateMpesa = () => {
    setPaid(true);
  };

  const dateLocale =
    i18n.language === 'am' ? 'am-ET' : i18n.language === 'om' ? 'om-ET' : undefined;

  if (!item) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-slate-900">{t('booking.notFoundTitle')}</h1>
        <p className="text-slate-600 mt-2">{t('booking.notFoundBody')}</p>
        <Link to="/search" className="inline-block mt-6 text-emerald-700 font-semibold hover:underline">
          {t('booking.browseRentals')}
        </Link>
      </div>
    );
  }

  if (paid) {
    const deadlineLabel = returnDeadline.toLocaleString(dateLocale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

    return (
      <div className="max-w-2xl mx-auto px-4 py-10 pb-16">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
            <CheckCircle2 className="h-9 w-9 text-emerald-700" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{t('booking.paymentComplete')}</h1>
          <p className="text-slate-600 mt-2 max-w-md mx-auto">{t('booking.paymentBody')}</p>
          <p className="text-sm text-slate-500 mt-3">
            {t('booking.returnDeadlineLabel')}{' '}
            <span className="font-semibold text-slate-800">{deadlineLabel}</span>
          </p>
        </div>

        <ReturnDeadlineCountdown deadline={returnDeadline} lateFeePerHour={5} />

        <p className="text-center text-sm text-slate-500 mt-6">{t('booking.remindersNote')}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/search"
            className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-slate-800 font-semibold hover:bg-slate-50 transition"
          >
            {t('booking.browseMore')}
          </Link>
          <Link
            to="/"
            className="inline-flex justify-center rounded-xl bg-emerald-700 px-6 py-3 text-white font-semibold hover:bg-emerald-800 transition"
          >
            {t('booking.home')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-16">
      <Link
        to="/search"
        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:underline mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('booking.backBrowse')}
      </Link>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-[4/3] bg-slate-100">
              <img src={item.image} alt="" className="h-full w-full object-cover" />
              {item.owner_type === 'company' && (
                <span className="absolute top-3 right-3 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white">
                  {t('search.businessLenderTitle')}
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                {t(`categories.${item.category}`)}
              </p>
              <h1 className="text-lg font-bold text-slate-900 mt-1">{item.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {t('booking.reviews', { rating: item.rating, count: item.reviews })}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-700" />
              {t('booking.notifications')}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="font-medium text-slate-800">{t('booking.label24h')}</span> {t('booking.notif24')}
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-slate-800">{t('booking.label1h')}</span> {t('booking.notif1h')}
              </li>
              <li className="flex gap-2 items-start">
                <MessageSquareWarning className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                {t('booking.notifLate')}
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              {t('booking.afterReturnTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-2">{t('booking.afterReturnBody')}</p>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t('booking.dates')}</h2>
            <p className="text-sm text-slate-500 mt-1">{t('booking.datesHint')}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5" /> {t('booking.start')}
                </span>
                <input
                  type="date"
                  value={startDate}
                  min={today}
                  onChange={(e) => {
                    const v = e.target.value;
                    setStartDate(v);
                    if (endDate < v) setEndDate(defaultEndDate(v));
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-slate-600 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5" /> {t('booking.returnByDate')}
                </span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </label>
            </div>
            <label className="block mt-4 max-w-xs">
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" /> {t('booking.returnByTime')}
              </span>
              <input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-slate-900 focus:border-emerald-500 focus:ring-emerald-500"
              />
              <p className="text-xs text-slate-500 mt-1">{t('booking.returnTimeHint')}</p>
            </label>
            <p className="text-sm text-slate-600 mt-3">
              <span className="font-semibold text-slate-800">
                {t('booking.rentalDays', { count: days })}
              </span>{' '}
              ·{' '}
              <span className="font-semibold text-emerald-800">
                {t('booking.perDayRate', { price: item.price_per_day.toFixed(2) })}
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-700" />
              {t('booking.costBreakdown')}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-600">
                  {t('booking.rentalLine', {
                    days,
                    price: item.price_per_day.toFixed(2),
                  })}
                </dt>
                <dd className="font-medium text-slate-900">${rentalSubtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-600">{t('booking.platformFeeLine')}</dt>
                <dd className="font-medium text-slate-900">${platformFee.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-100 pt-3">
                <dt className="text-slate-700 font-medium">{t('booking.depositLine')}</dt>
                <dd className="font-semibold text-slate-900">${deposit.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-base">
                <dt className="font-bold text-slate-900">{t('booking.totalLine')}</dt>
                <dd className="font-bold text-emerald-800">${totalDue.toFixed(2)}</dd>
              </div>
            </dl>
            <p className="text-xs text-slate-500 mt-3">{t('booking.policyNote')}</p>
          </div>

          <button
            type="button"
            onClick={handleSimulateMpesa}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-4 text-white font-semibold shadow-md hover:bg-emerald-800 transition active:scale-[0.99]"
          >
            <Smartphone className="w-5 h-5" />
            {t('booking.payMpesa')}
          </button>
          <p className="text-center text-xs text-slate-400">{t('booking.demoOnly')}</p>
        </div>
      </div>
    </div>
  );
}
