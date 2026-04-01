const STORAGE_KEY = 'rentlink_demo_bookings_v1';

export type DemoBookingStatus = 'active' | 'completed' | 'cancelled';

export type DemoBookingRecord = {
  id: string;
  createdAt: string;
  itemId: number;
  itemTitle: string;
  category: string;
  renterEmail: string;
  startDate: string;
  endDate: string;
  returnTime: string;
  days: number;
  rentalSubtotal: number;
  platformFee: number;
  deposit: number;
  totalDue: number;
  status: DemoBookingStatus;
  /** How the booking was paid (demo vs real STK) */
  paymentMethod?: 'mpesa_stk' | 'demo_simulated' | 'mpesa_test_mode';
  /** Safaricom CheckoutRequestID when STK was accepted */
  mpesaCheckoutId?: string;
  /** Amount charged in ETB (STK) */
  amountEtb?: number;
};

function safeParse(raw: string | null): DemoBookingRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row): row is DemoBookingRecord =>
        typeof row === 'object' &&
        row !== null &&
        typeof (row as DemoBookingRecord).id === 'string',
    );
  } catch {
    return [];
  }
}

export function getDemoBookings(): DemoBookingRecord[] {
  if (typeof window === 'undefined') return [];
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function recordDemoBooking(
  payload: Omit<DemoBookingRecord, 'id' | 'createdAt' | 'status'>,
): DemoBookingRecord {
  const row: DemoBookingRecord = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'active',
  };
  const list = getDemoBookings();
  list.unshift(row);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return row;
}

export function updateDemoBookingStatus(id: string, status: DemoBookingStatus): void {
  const list = getDemoBookings();
  const next = list.map((b) => (b.id === id ? { ...b, status } : b));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearAllDemoBookings(): void {
  localStorage.removeItem(STORAGE_KEY);
}
