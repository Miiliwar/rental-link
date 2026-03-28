import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  Download,
  LayoutDashboard,
  Package,
  RefreshCw,
  Shield,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { DEMO_ITEMS } from '../data/demoItems';
import {
  clearAllDemoBookings,
  getDemoBookings,
  type DemoBookingRecord,
  type DemoBookingStatus,
  updateDemoBookingStatus,
} from '../services/demoBookings';
import { getAdminDemoEmail } from '../utils/admin';

function downloadCsv(rows: DemoBookingRecord[], filename: string) {
  const headers = [
    'id',
    'createdAt',
    'itemTitle',
    'category',
    'renterEmail',
    'startDate',
    'endDate',
    'days',
    'rentalSubtotal',
    'platformFee',
    'deposit',
    'totalDue',
    'status',
  ];
  const escape = (v: string | number) => {
    const s = String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
        r.id,
        r.createdAt,
        r.itemTitle,
        r.category,
        r.renterEmail,
        r.startDate,
        r.endDate,
        r.days,
        r.rentalSubtotal,
        r.platformFee,
        r.deposit,
        r.totalDue,
        r.status,
      ]
        .map(escape)
        .join(','),
    ),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  const { t, i18n } = useTranslation();
  const [bookings, setBookings] = useState(() => getDemoBookings());
  const [resetting, setResetting] = useState(false);

  const refresh = useCallback(() => setBookings(getDemoBookings()), []);

  const stats = useMemo(() => {
    const totalCommission = bookings.reduce((s, b) => s + b.platformFee, 0);
    const totalRental = bookings.reduce((s, b) => s + b.rentalSubtotal, 0);
    const active = bookings.filter((b) => b.status === 'active').length;
    return {
      listings: DEMO_ITEMS.length,
      bookings: bookings.length,
      active,
      totalRental: Math.round(totalRental * 100) / 100,
      totalCommission: Math.round(totalCommission * 100) / 100,
    };
  }, [bookings]);

  const categoryCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const item of DEMO_ITEMS) {
      m.set(item.category, (m.get(item.category) ?? 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const dateLocale =
    i18n.language === 'am' ? 'am-ET' : i18n.language === 'om' ? 'om-ET' : undefined;

  const handleStatusChange = (id: string, status: DemoBookingStatus) => {
    updateDemoBookingStatus(id, status);
    refresh();
  };

  const handleReset = () => {
    if (!window.confirm(t('admin.resetConfirm'))) return;
    setResetting(true);
    clearAllDemoBookings();
    refresh();
    setResetting(false);
  };

  const handleExport = () => {
    downloadCsv(bookings, `rentlink-demo-bookings-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900 mb-3">
            <Shield className="w-3.5 h-3.5" />
            {t('admin.badge')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-emerald-700 shrink-0" />
            {t('admin.title')}
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">{t('admin.subtitle')}</p>
          <p className="text-sm text-slate-500 mt-2">
            {t('admin.demoEmailHint', { email: getAdminDemoEmail() })}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={bookings.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <Download className="w-4 h-4" />
            {t('admin.exportCsv')}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={resetting || bookings.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-800 hover:bg-red-100 disabled:opacity-50 transition"
          >
            <Trash2 className="w-4 h-4" />
            {t('admin.resetBookings')}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{t('admin.statListings')}</p>
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.listings}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{t('admin.statBookings')}</p>
            <BarChart3 className="w-5 h-5 text-sky-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{stats.bookings}</p>
          <p className="text-xs text-slate-500 mt-1">
            {t('admin.statActive', { count: stats.active })}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{t('admin.statRentalVolume')}</p>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">${stats.totalRental.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mt-1">{t('admin.statRentalHint')}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{t('admin.statCommission')}</p>
            <Wallet className="w-5 h-5 text-violet-600" />
          </div>
          <p className="text-3xl font-bold text-emerald-800 mt-2">
            ${stats.totalCommission.toFixed(2)}
          </p>
          <p className="text-xs text-slate-500 mt-1">{t('admin.statCommissionHint')}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mb-10">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">{t('admin.bookingsTitle')}</h2>
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-900"
            >
              <RefreshCw className="w-4 h-4" />
              {t('admin.refresh')}
            </button>
          </div>
          {bookings.length === 0 ? (
            <div className="px-5 py-12 text-center text-slate-500 text-sm">{t('admin.noBookings')}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3">{t('admin.colDate')}</th>
                    <th className="px-4 py-3">{t('admin.colItem')}</th>
                    <th className="px-4 py-3">{t('admin.colRenter')}</th>
                    <th className="px-4 py-3 text-right">{t('admin.colRental')}</th>
                    <th className="px-4 py-3 text-right">{t('admin.colFee')}</th>
                    <th className="px-4 py-3">{t('admin.colStatus')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {new Date(b.createdAt).toLocaleString(dateLocale, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900 max-w-[180px] truncate" title={b.itemTitle}>
                          {b.itemTitle}
                        </div>
                        <div className="text-xs text-slate-500">{t(`categories.${b.category}`)}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-[160px] truncate" title={b.renterEmail}>
                        {b.renterEmail}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">${b.rentalSubtotal.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-emerald-800">
                        ${b.platformFee.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={b.status}
                          onChange={(e) =>
                            handleStatusChange(b.id, e.target.value as DemoBookingStatus)
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
                        >
                          <option value="active">{t('admin.statusActive')}</option>
                          <option value="completed">{t('admin.statusCompleted')}</option>
                          <option value="cancelled">{t('admin.statusCancelled')}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">{t('admin.catalogTitle')}</h2>
            <p className="text-xs text-slate-500 mt-1">{t('admin.catalogHint')}</p>
          </div>
          <ul className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
            {categoryCounts.map(([cat, count]) => (
              <li key={cat} className="px-5 py-3 flex justify-between items-center text-sm">
                <span className="text-slate-800">{t(`categories.${cat}`)}</span>
                <span className="font-semibold text-slate-600 tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400">{t('admin.footerNote')}</p>
    </div>
  );
}
