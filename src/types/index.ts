export type Language = 'en' | 'hi';

export interface Service {
  id: string;
  slug: string;
  title: string;        // English
  titleHi: string;      // Hindi
  description: string;
  descriptionHi: string;
  icon: string;         // lucide icon name
  category: 'instant' | 'permanent' | 'both';
  basePrice: number;    // per hour for instant, per month for permanent
  duration?: string;    // e.g., '2-4 hours'
  image: string;
  inclusions: string[];
  exclusions: string[];
}

export interface Helper {
  id: string;
  name: string;
  nameHi: string;
  age: number;
  gender: 'male' | 'female';
  photo: string;
  bio: string;
  bioHi: string;
  experience: number; // years
  languages: string[];
  skills: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  monthlySalary: number;
  workPreference: ('hourly' | 'part-time' | 'full-time' | 'live-in')[];
  availability: 'available' | 'busy' | 'on-leave';
  verified: boolean;
  policeVerified: boolean;
  aadhaarVerified: boolean;
  vaccinated: boolean;
  city: string;
  area: string;
  serviceIds: string[];
}

export interface Review {
  id: string;
  helperId: string;
  customerName: string;
  rating: number;
  comment: string;
  commentHi: string;
  date: string;
  serviceName: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  commentHi: string;
  avatar: string;
}

export interface Booking {
  id: string;
  customerId: string;
  helperId: string;
  serviceId: string;
  type: 'instant' | 'monthly' | 'half-yearly' | 'yearly';
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  date: string;
  timeSlot?: string;
  address: Address;
  totalAmount: number;
  specialInstructions?: string;
}

export interface Address {
  id: string;
  tag: 'home' | 'work' | 'other';
  flatNo: string;
  street: string;
  landmark?: string;
  city: string;
  pincode: string;
}

export interface City {
  name: string;
  nameHi: string;
  state: string;
  available: boolean;
}

export interface FAQItem {
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
  category: string;
}

export interface BookingStep {
  id: number | string;
  title: string | { en: string; hi: string };
  titleHi?: string;
}
