# 🎨 Qwikaam — Frontend Architecture

Yeh folder Qwikaam platform ke **Client-Side (User Interface & Design)** ka poora code contain karta hai.

---

## 📁 Folder Structure

### 1. `pages/` (All Screen Views & User Flows)
- **`page.tsx`**: Landing Home Page (Hero, Instant services strip, Trust badges, Testimonials, CTA)
- **`services/`**: Services listing (Instant & Permanent tabs) + Individual dynamic service pages (`[slug]`)
- **`helpers/`**: Helper search & directory + Detailed helper profile pages (`[id]`)
- **`book/`**: 
  - `instant/`: 4-step wizard for instant hourly booking
  - `permanent/`: 4-step wizard for permanent monthly hiring
- **`nearby/`**: GPS Geolocation interactive map showing helpers in Risali Sector with live distance (km) & ETA
- **`admin/`**: Admin portal, helper onboarding form, and 3-level verification center
- **`login/` & `signup/`**: Dual-role authentication UI (Customer & Helper registration)
- **`dashboard/`**: User dashboard (My Bookings, Helpers, Saved Addresses)
- **`pricing/`, `about/`, `contact/`, `faq/`, `terms/`, `privacy/`**: Static information pages

---

### 2. `components/` (Reusable UI Components)
- **`layout/`**: Top Navbar with active tab highlights, Footer, Mobile Bottom Navigation Bar
- **`booking/`**: ServiceSelector, TimeSlotPicker, AddressForm, BookingSummary, BookingConfirmation, HelperShortlist, RequirementsForm
- **`nearby/`**: NearbyHelpers & NearbyMap (Leaflet map integration)
- **`reviews/`**: ReviewForm (1-5 star selector) & ReviewSection (Rating bar charts)
- **`ui/`**: HelperCard, ServiceCard, StarRating, Badge, VerificationBadges

---

### 3. `context/` & `data/`
- **`context/LanguageContext.tsx`**: Real-time Hindi / English language switcher
- **`data/`**: Mock datasets for services, helpers, cities, FAQs, and reviews
