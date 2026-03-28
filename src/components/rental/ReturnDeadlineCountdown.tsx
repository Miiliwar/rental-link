import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, AlertTriangle } from 'lucide-react';

export function parseReturnDeadline(dateStr: string, timeStr: string): Date {
  const [y, M, d] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  return new Date(y, M - 1, d, h, min, 0, 0);
}

type Props = {
  deadline: Date;
  /** Demo: extra charge per hour after deadline (USD) */
  lateFeePerHour?: number;
};

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export function ReturnDeadlineCountdown({ deadline, lateFeePerHour = 5 }: Props) {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMs = deadline.getTime() - now;
  const overdue = remainingMs < 0;
  const absMs = Math.abs(remainingMs);

  const totalSeconds = Math.floor(absMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const overdueHours = overdue ? absMs / (60 * 60 * 1000) : 0;
  const lateFeeEstimate = overdue ? Math.ceil(overdueHours) * lateFeePerHour : 0;

  const blocks = [
    { label: t('countdown.days'), value: pad(days) },
    { label: t('countdown.hours'), value: pad(hours) },
    { label: t('countdown.min'), value: pad(minutes) },
    { label: t('countdown.sec'), value: pad(seconds) },
  ];

  return (
    <div
      className={`rounded-2xl border-2 p-6 shadow-lg transition-colors ${
        overdue
          ? 'border-red-200 bg-gradient-to-br from-red-50 to-amber-50'
          : 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-slate-50'
      }`}
    >
      <div className="flex items-center justify-center gap-2 text-center mb-4">
        {overdue ? (
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
        ) : (
          <Clock className="w-6 h-6 text-emerald-700 shrink-0" />
        )}
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {overdue ? t('countdown.returnOverdue') : t('countdown.timeUntilDeadline')}
          </h3>
          <p className="text-xs text-slate-600">
            {overdue ? t('countdown.overdueHelp') : t('countdown.onTimeHelp')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {blocks.map((b) => (
          <div
            key={b.label}
            className={`rounded-xl px-3 py-4 text-center shadow-sm ${
              overdue ? 'bg-white/90 border border-red-100' : 'bg-white/90 border border-emerald-100'
            }`}
          >
            <div
              className={`text-2xl sm:text-3xl font-mono font-bold tabular-nums ${
                overdue ? 'text-red-700' : 'text-emerald-900'
              }`}
            >
              {b.value}
            </div>
            <div className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-slate-500 mt-1">
              {b.label}
            </div>
          </div>
        ))}
      </div>

      {overdue && (
        <div className="mt-4 rounded-xl bg-red-100/80 border border-red-200 px-4 py-3 text-sm text-red-900">
          <span className="font-semibold">{t('countdown.estimatedLateFee')}</span>{' '}
          <span className="font-mono font-bold">${lateFeeEstimate.toFixed(2)}</span>
          <span className="text-red-800/80"> {t('countdown.perHourCeil', { rate: lateFeePerHour })}</span>
        </div>
      )}
    </div>
  );
}
