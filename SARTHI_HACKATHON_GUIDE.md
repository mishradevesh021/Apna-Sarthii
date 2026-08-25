# 🏆 SARTHI (सारथी) — Hackathon Master Defense & Preparation Guide
### *"Your Trusted Companion for Local Services"*

---

## 📌 Table of Contents
1. [Executive Summary & The Market Problem](#1-executive-summary--the-market-problem)
2. [High-Level Technical Architecture](#2-high-level-technical-architecture)
3. [Algorithmic Innovations (The "Secret Sauce")](#3-algorithmic-innovations-the-secret-sauce)
4. [Job Lifecycle State Machine & Database Design](#4-job-lifecycle-state-machine--database-design)
5. [File-by-File Codebase Walkthrough](#5-file-by-file-codebase-walkthrough)
6. [The Winning Hackathon Pitch Blueprint](#6-the-winning-hackathon-pitch-blueprint)
7. [Top 25 Toughest Hackathon Judge Q&As](#7-top-25-toughest-hackathon-judge-qas)
8. [Roadmap, Monetization & Scalability](#8-roadmap-monetization--scalability)

---

## 1. Executive Summary & The Market Problem

### What is Sarthi?
**SARTHI (सारथी)** means *"The Trusted Charioteer / Guide"*. It is an on-demand, mobile-first hyperlocal platform that connects everyday households with verified neighborhood tradesmen (electricians, plumbers, masons, carpenters, appliance technicians, and painters) with zero middlemen commissions.

### The Real-World Market Problem (The $50B Unorganized Market)
1. **Middlemen Commission Traps (Urban Company):** Existing platforms take 25–35% cuts from workers, causing workers to resent the platform and customers to pay inflated rates.
2. **Directory Spam (JustDial / Sulekha):** Search directories sell customer contact numbers to 10 competing contractors who spam the customer with calls.
3. **Zero Verification & Safety Risks:** Families invite unverified strangers into their homes without knowing if their ID or credentials are authentic.
4. **Tech Literacy Gap:** Blue-collar workers in Tier-2/Tier-3 cities cannot navigate complex apps. Sarthi gives them a 1-tap, visual, high-contrast interface.

---

## 2. High-Level Technical Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Mobile & Web)                     │
│  Next.js 14 App Router • React 18 • Tailwind CSS • Lucide Icons        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON API Fetch
┌───────────────────────────────────▼────────────────────────────────────┐
│                  SERVER RUNTIME & API ROUTE HANDLERS                   │
│  • Edge Dynamic Routes (/api/workers, /api/services, /api/requests)    │
│  • Stateless Signed JWT Cookie Authenticator (Jose 5.9 + Bcrypt)       │
│  • Role-Based Access Control Guards (CUSTOMER | WORKER | ADMIN)        │
│  • AI Problem Diagnostics & NLP Engine (src/lib/ai-assistant.ts)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌───────────────────────────────────────┐   ┌────────────────────────────────────┐
│         PRISMA ORM DATABASE           │   │    IN-MEMORY / SEED REPO FALLBACK  │
│  13 Relational Tables (Postgres/SQLite)│   │  Zero-crash Serverless Engine      │
│  (Users, Profiles, Requests, Reviews) │   │  (Immediate Demo State & Workers)  │
└───────────────────────────────────────┘   └────────────────────────────────────┘
```

---

## 3. Algorithmic Innovations (The "Secret Sauce")

### 1. Haversine Proximity Formula (`src/lib/matching.ts`)
Calculates the great-circle distance between the customer's coordinates $(\phi_1, \lambda_1)$ and the worker's coordinates $(\phi_2, \lambda_2)$:

$$d = 2R \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)} \right)$$

### 2. Multi-Factor Match Score Formula
$$\text{Score} = (100 - 5 \times \text{distanceKm}) + (\text{Rating} \times 8) + (\text{VerifiedBadge} \times 15) + (\text{Availability} \times 10) + (\text{EmergencyBonus} \times 10)$$

### 3. AI Problem Diagnostician (`src/lib/ai-assistant.ts`)
- Parses natural-language complaints (e.g. *"fan regulator is sparking and humming"*).
- Extracts category (`Electrician`), suggested repair, labor price benchmark (₹250), and surfaces critical safety warnings (*"Turn off main circuit breaker before inspecting"*).

---

## 4. Job Lifecycle State Machine & Database Design

### The 6-Stage Deterministic Progress:
`REQUESTED` ➔ `ACCEPTED` ➔ `ON_THE_WAY` ➔ `ARRIVED` ➔ `IN_PROGRESS` ➔ `COMPLETED`

### Key Database Tables (13 Models in `prisma/schema.prisma`):
- `User`: Central authentication & profile.
- `CustomerProfile` & `WorkerProfile`: 1-to-1 extension profiles.
- `ServiceCategory`: 12 curated trades.
- `ServiceRequest`: The central booking contract.
- `JobTimeline`: Immutable timestamped audit log.
- `Review`: Multi-metric rating system with atomic recalculation.

---

## 5. File-by-File Codebase Walkthrough

| File Path | Role & Purpose |
| :--- | :--- |
| `src/app/page.tsx` | Master Home Page with CategoryGrid, SearchHero, Emergency banner, and nearby Worker Cards. |
| `src/components/home/CategoryGrid.tsx` | 12 trade categories with screenshot-accurate colored badges & custom SVG icons. |
| `src/components/ai/AIDiagnoseModal.tsx` | Interactive AI Problem Assistant modal for symptom diagnosis. |
| `src/app/worker/dashboard/page.tsx` | Worker dispatch console with 1-click status stepper progression. |
| `src/app/admin/page.tsx` | Admin Command Center with All Users & Workers directory and verification badge approval. |
| `src/lib/matching.ts` | Haversine distance and smart score ranking algorithm. |
| `src/lib/auth.ts` & `jwt.ts` | Stateless JWT authentication, Bcrypt hashing, and RBAC guards. |

---

## 6. The Winning Hackathon Pitch Blueprint

### 30-Second Elevator Pitch
> *"Good morning judges. When an electrical spark happens or a pipe bursts at night in Tier-2/3 India, households face chaotic phone directories, overpriced middlemen, and unverified strangers. We built SARTHI — an AI-guided, mobile-first hyperlocal platform matching customers with verified neighborhood electricians and plumbers in under 30 seconds. Featuring plain-language AI problem diagnosis, upfront pricing, live tracking, and zero worker commissions, Sarthi empowers both Bharat households and local tradesmen."*

### 3-Minute Live Demo Flow
1. **Show AI Diagnosis:** Type *"My fan regulator is sparking"* ➔ observe instant Electrician categorization, ₹250 labor benchmark, and safety alert.
2. **Show Smart Search:** Highlight Rahul Kumar (Electrician, 4.9⭐, 1.8 km away) ranked #1 by Haversine distance.
3. **Place Booking:** Book service as Priya Singh (Customer).
4. **Switch to Worker:** Use top 1-click Demo Switcher ➔ open Worker Dashboard ➔ progress status from `ACCEPTED` to `COMPLETED`.
5. **Verified Review & Admin:** Submit 5-star review, show dynamic rating recalculation, and switch to Admin Command Center to view the live user directory.

---

## 7. Top 10 Hardest Hackathon Judge Q&As

### Q1: How is Sarthi different from Urban Company or JustDial?
> **Answer:** Urban Company takes 25-35% commission and focuses on metro Tier-1. JustDial sells phone numbers leading to spam calls. Sarthi is zero-commission, hyperlocal, protects user privacy with in-app chat, and provides live 6-stage status tracking.

### Q2: How do you prevent users and workers from bypassing the platform?
> **Answer:** Our Trust & Growth Flywheel: Every job completed on Sarthi increases the worker's verified count and search ranking, bringing them 10x more high-paying clients. Customers receive timeline audit safety and dispute resolution.

### Q3: How do you verify workers without expensive manual background checks?
> **Answer:** A 3-tier pipeline: (1) Aadhaar/Govt ID verification, (2) Trade credential and local association reference check, (3) Graduated community vetting (New Pro to Verified Master Pro after 5 high-rated jobs).

### Q4: What is your monetization and business model?
> **Answer:** Three sustainable streams: (1) Worker Premium Subscriptions (₹199/mo for priority leads), (2) Micro-Insurance fee (₹10/job for accidental damage cover), (3) Commercial B2B maintenance contracts.

### Q5: How does the application scale to millions of users?
> **Answer:** Built on Next.js 14 Serverless architecture with lightweight bundle size (87 kB shared), stateless JWT sessions in HTTP-only cookies, and connection-pooled PostgreSQL with Prisma ORM.

---

## 8. Roadmap & Future Scalability

- **Phase 1 (Current):** MVP pilot in Prayagraj & Lucknow with 100+ verified workers and AI assistant.
- **Phase 2:** Vernacular Voice AI (Hindi, Bhojpuri, Tamil speech recognition) & WhatsApp Bot fallback.
- **Phase 3:** Sarthi Suraksha: ₹50,000 on-duty worker health insurance and tool micro-financing.
