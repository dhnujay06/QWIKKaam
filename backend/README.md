# ⚙️ Qwikkaam — Backend Architecture & APIs

Yeh folder Qwikkaam platform ke **Server-Side (APIs, Business Logic & Database)** ka poora code contain karta hai.

---

## 📁 Folder Structure

### 1. `api/` (REST Endpoints & Server Handlers)
- **`auth/`**:
  - `send-otp/`: Generates 6-digit OTP codes and saves to database
  - `[...nextauth]/`: NextAuth credential provider verifying phone & OTP sessions
- **`register/`**: Handles dual-role customer & helper profile creation
- **`bookings/`**: Handles booking creation, scheduling, status updates, and user booking retrieval
- **`helpers/`**: Queries active helpers filtered by city (Bhilai) and area (Risali)
- **`reviews/`**: Handles review submission and automatic helper average rating recalculation
- **`admin/`**:
  - `add-helper/`: Allows admin to register non-smartphone helpers
  - `helpers/`: Fetches helpers and toggles live availability
  - `verify/`: 3-level verification engine (Admin, Aadhaar, Police, Vaccinated)

---

### 2. `database/` (PostgreSQL Schema & Prisma ORM)
- **`schema.prisma`**:
  - `User` (Customers, Helpers, Admin)
  - `HelperProfile` (Rates, skills, experience, verification levels)
  - `Booking` (Instant hourly / Permanent monthly contracts)
  - `Review` (Ratings 1-5, comments)
  - `OtpCode` (OTP expiration and verification)
  - `Address` (Saved customer addresses)
  - `ServiceArea` (Hyperlocal areas in Bhilai)

---

### 3. `lib/` & `types/`
- **`lib/prisma.ts`**: Supabase PostgreSQL singleton client
- **`lib/auth.ts`**: Server-side authentication configuration
- **`types/`**: TypeScript interfaces and NextAuth session extensions
