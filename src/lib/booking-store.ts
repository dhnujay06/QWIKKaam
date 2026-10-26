// In-Memory & Resilient Persistent Fallback Booking Store for Qwikkaam
import fs from 'fs';
import path from 'path';

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

// Determine safe storage path for persistence
function getStorageFilePath(): string | null {
  try {
    const dir = process.env.NODE_ENV === 'production' && process.env.VERCEL
      ? '/tmp'
      : path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return path.join(dir, 'bookings-cache.json');
  } catch {
    return null;
  }
}

function loadInitialBookings(): StoredBooking[] {
  try {
    const filePath = getStorageFilePath();
    if (filePath && fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Error reading bookings cache:', e);
  }
  return [];
}

function persistBookings(bookings: StoredBooking[]) {
  try {
    const filePath = getStorageFilePath();
    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2), 'utf8');
    }
  } catch (e) {
    console.warn('Error saving bookings cache:', e);
  }
}

export const fallbackBookingsStore: StoredBooking[] = 
  globalForStore.qwikkaamBookings || loadInitialBookings();

globalForStore.qwikkaamBookings = fallbackBookingsStore;

export function addFallbackBooking(booking: StoredBooking) {
  // Avoid duplicate ID
  const existingIdx = fallbackBookingsStore.findIndex(b => b.id === booking.id);
  if (existingIdx >= 0) {
    fallbackBookingsStore[existingIdx] = booking;
  } else {
    fallbackBookingsStore.unshift(booking);
  }
  persistBookings(fallbackBookingsStore);
  return booking;
}

export function getFallbackBookings(): StoredBooking[] {
  return fallbackBookingsStore;
}

export function updateFallbackBooking(id: string, updates: Partial<StoredBooking>) {
  const b = fallbackBookingsStore.find(item => item.id === id);
  if (b) {
    Object.assign(b, updates);
    persistBookings(fallbackBookingsStore);
    return b;
  }
  return null;
}
