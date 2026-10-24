// In-Memory & Resilient Fallback Booking Store for Qwikkaam
export interface StoredBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  type: string;
  status: string;
  scheduledDate: string;
  timeSlot: string;
  durationHours?: number;
  baseAmount: number;
  serviceFee: number;
  gstAmount: number;
  totalAmount: number;
  specialInstructions?: string;
  createdAt: string;
  customer: {
    id?: string;
    name: string;
    phone: string;
  };
  address?: {
    id?: string;
    flatNo?: string;
    street?: string;
    landmark?: string;
    area?: string;
    city?: string;
    pincode?: string;
  };
  helper?: {
    id: string;
    user: {
      name: string;
      phone: string;
    };
  } | null;
}

const globalForStore = globalThis as unknown as {
  qwikkaamBookings: StoredBooking[] | undefined;
};

export const fallbackBookingsStore: StoredBooking[] = globalForStore.qwikkaamBookings || [];
globalForStore.qwikkaamBookings = fallbackBookingsStore;

export function addFallbackBooking(booking: StoredBooking) {
  fallbackBookingsStore.unshift(booking);
  return booking;
}

export function getFallbackBookings() {
  return fallbackBookingsStore;
}

export function updateFallbackBooking(id: string, updates: Partial<StoredBooking>) {
  const b = fallbackBookingsStore.find(item => item.id === id);
  if (b) {
    Object.assign(b, updates);
    return b;
  }
  return null;
}
