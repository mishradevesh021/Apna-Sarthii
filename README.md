# 🚀 SARTHI (सारथी)
### *Your Trusted Companion for Local Services*

SARTHI is a modern, mobile-first local service discovery and dispatch platform that connects everyday households with verified, background-checked local professionals (electricians, plumbers, carpenters, mechanics, appliance repair technicians, painters, and more).

---

## 🌟 Highlights & Features

- **📱 Mobile-First Native Experience**: Elegant, responsive UI with fixed bottom dock, quick search, and interactive city/locality filter (`📍 Prayagraj · Civil Lines`).
- **🤖 AI Problem Diagnostician**: Natural language issue analysis that extracts category, suggested repair, estimated costs, and safety warnings.
- **⚡ 24×7 Emergency Dispatch**: 1-click filter for emergency technicians on call right now.
- **🎯 Smart Worker Matching**: Proximity-aware Haversine scoring based on availability, ratings, verified credentials, and response rates.
- **🔄 Live Job Lifecycle Stepper**: Full real-time audit timeline across 6 states (`REQUESTED` ➔ `ACCEPTED` ➔ `ON_THE_WAY` ➔ `ARRIVED` ➔ `IN_PROGRESS` ➔ `COMPLETED`).
- **⭐ Multi-Metric Reviews**: Verified reviews for punctuality, quality, and value with automatic average rating recalculation.
- **💬 In-App Messaging**: Safe communication channel between customers and professionals.
- **🛡️ Admin Command Center**: Operations oversight, worker badge verification, dispute resolution, and marketplace GMV analytics.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Next.js Server Actions & Route Handlers
- **Database & ORM**: Prisma ORM with SQLite (100% PostgreSQL / Supabase compatible)
- **Authentication**: Stateless JWT in HTTP-only cookies with Bcrypt password hashing & RBAC
- **Validation**: Zod schema validation

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/sarthi.git
cd sarthi
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Initialize & Seed Database
```bash
npx prisma db push
node prisma/seed.js
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Accounts (Out-of-the-box)

| Role | Email | Password | Context |
| :--- | :--- | :--- | :--- |
| **Customer** | `demo.customer@sarthi.local` | `Password@123` | Priya Singh (Prayagraj) |
| **Worker** | `demo.worker@sarthi.local` | `Password@123` | Rahul Kumar (Electrician) |
| **Admin** | `demo.admin@sarthi.local` | `Password@123` | Admin Staff |

---

## 📄 License
MIT License. Built with ❤️ for local empowerment.
