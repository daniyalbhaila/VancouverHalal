# Strategic Roadmap: Dineout (Vancouver Halal)

## Strategy Overview
We are building the **trust layer** for Halal dining. Unlike Google Maps (broad data), we win by providing **specific context** (alcohol policy, hand-slaughtered status) and **community verification**.

---

## 🎯 Launch Target: RAMADAN 2026
**Ramadan starts ~Feb 28, 2026 (20 days away)**

This is our launch window. Muslims will be actively searching for:
- "Ramadan deals Vancouver"
- "Iftar restaurants Vancouver"
- "Best halal restaurants Vancouver"

**We launch BEFORE Ramadan. We ride the wave.**

### Ramadan-Specific Features (HIGH PRIORITY)
| Feature | Effort | Why |
|---------|--------|-----|
| **`/ramadan-deals-vancouver-2026`** | 1 day | SEO goldmine + curated list of Iftar specials |
| **Ramadan Deals Tag** | 2 hrs | Tag restaurants with Iftar deals (manual curation OK) |
| **"Submit Ramadan Deal" Form** | 4 hrs | Let restaurants/users submit deals |

### Ramadan Marketing Blitz (Week 2-3: Feb 10-28)
- [ ] **Reddit**: r/vancouver, r/islam, r/halal ("I built this for Ramadan")
- [ ] **Facebook Groups**: "Halal in Vancouver", "Vancouver Muslims", "Surrey Desis"
- [ ] **WhatsApp/Telegram**: Muslim community groups
- [ ] **TikTok/Reels**: "Best Iftar Spots in Vancouver 2026" (create 3-5 videos)
- [ ] **Mosque Bulletin Boards**: Print QR codes (old school but works)
- [ ] **Local Influencers**: DM Vancouver halal food bloggers

---

## Current State (What We Have Today)
- ✅ **250+ Halal restaurants** in Vancouver (from public halal lists)
- ✅ **Discovery**: List view + Map view
- ✅ **Filters**: Category, Distance, Open Now
- ✅ **Swipe Mode**: Gamified discovery (unique differentiator)
- ✅ **Saved List**: Works with localStorage
- ✅ **Restaurant Details Page**: Name, address, hours, category
- ⚠️ **Missing**: Images (gradient fallbacks), Halal verification indicators, Alcohol policy

---

## � Phase 1: Pre-Launch (Hybrid Data Strategy)
**Focus**: Seed Data + Community Intake.
**Goal**: The app has enough "good stuff" to be useful, but invites users to build the rest.
**Exit Criteria**: 50 Seeded Listings + 10 User Submissions.

### Must-Have for Launch
| Feature | Effort | Why |
|---------|--------|-----|
| **Trust Badges** ("Community Listed") | 2 hrs | Users need to know WHY it's on the list |
| **Disclaimer** | 30 min | "Sourced from public lists. Verify before dining." |
| **Report Issue Button** | 4 hrs | "Closed? Not Halal? Wrong info?" → builds trust loop |
| **UserJot/Feedback Widget** | 1 hr | Know what's actually broken from real users |
| **Analytics (PostHog/Plausible)** | 1 hr | See what users do, not what they say |

### Key Deliverables
- [ ] **"Suggest a Spot" (Priority)**:
    - **UI**: A simple "Add Restaurant" button (FAB) on the map/list.
    - **Flow**: User submits Name/Link -> Saved to Supabase (pending review) -> Admin approves.
    - **Why**: Captures the "I know a place!" energy immediately.
- [ ] **Real-Time Data Engine (TypeScript)**:
    - **Architecture**: Porting ingestion logic to `web/lib` so it can run *instantly* when an Admin approves a spot.
    - **Benefit**: No waiting for "nightly scripts". Data is live the moment it's verified.
    - **Task**: `web/scripts/enrich.ts` (for bulk seed) + `web/lib/ingest` (for single-item fetch).
- [ ] **AI "Risk Detection" (Safety)**:
    - **Source**: Since we lack menus, we use **Google Attributes** (`serves_beer`, `serves_wine`) + **Reviews**.
    - **Logic**: AI scans recent reviews for "Bacon", "Pork", "Alcohol" mentions.
    - **Output**: Flags "High Risk" spots (e.g. "Reviewer mentioned 'best wine list'").
- [ ] **Halal Schema**:
    - Add `alcohol_policy`, `meat_origin` columns so users *can* report on them.

---

## 🟡 Phase 2: Soft Launch (0 → 1,000 Users)
**Focus**: Acquisition & Initial Retention.
**Goal**: Get people to use this instead of Google Maps/IG for Halal searches.
**Exit Criteria**: 20% Returning User Rate (Retention).

### Key Deliverables
- [ ] **"What's Good Here?" (The Hook)**:
    - AI scans reviews to generate a 1-sentence summary: *"Crowd favorites are the Lamb Shank and Mango Lassi."*
    - **Why**: Replaces reading 50 Google Reviews.
- [ ] **Social Proof Integration**:
    - Embed specific TikTok/IG reviews on restaurant cards ("As seen on...").
    - **Why**: Solves the "is this place actually good?" anxiety.
- [ ] **Smart Filtering**:
    - Filter by "No Alcohol" (for strict diners) vs "Open Late" (for youth).
    - **Why**: Addresses the distinct needs of our two main personas.
- [ ] **Programmatic SEO**:
    - Auto-generate: `/best-halal-[cuisine]-vancouver` (burgers, indian, chinese, etc.)
    - Auto-generate: `/halal-restaurants-[neighborhood]` (downtown, surrey, burnaby)
    - Auto-generate: `/best-iftar-restaurants-vancouver`, `/halal-buffet-vancouver`

---

## 🔵 Phase 3: Growth & Community (1,000 → 10,000 Users)
**Focus**: Deepening Engagement & Crowdsourcing.
**Goal**: Shift burden of verification from US to the COMMUNITY.
**Exit Criteria**: >5 user-submitted edits/votes per day.

### Key Deliverables
- [ ] **User Accounts & Favorites**:
    - "Save to Cloud" (Supabase Auth).
    - Shareable lists ("My Top 5 Date Spots").
- [ ] **Crowdsourced Verification**:
    - "Upvote/Downvote" Halal status accuracy.
    - "Report Closed" button.
- [ ] **Halal Status System**:
    - `certified` / `muslim_owned` / `community_listed` / `unverified`
    - Display badges on cards and detail pages.
- [ ] **Review Summaries**:
    - AI-generated summaries of what *Halal* diners say (e.g. "Great food but alcohol served at bar").

---

## 🟣 Phase 4: Scale & Monetization (10k+ Users)
**Focus**: Revenue without compromising trust.
**Entry Criteria**: High consistent traffic (e.g. 5k monthly active users).

### Key Deliverables
- [ ] **Featured Listings (B2B)**:
    - Paid placement for "Trending" spots (clearly marked).
- [ ] **Affiliate Revenue**:
    - "Order Delivery" buttons (UberEats/DoorDash affiliate links).
- [ ] **Premium Tier**:
    - "Dineout Gold" – Exclusive deals at partner restaurants.
- [ ] **Data Products**:
    - Selling "Halal Trend Reports" to restaurant suppliers.

---

## Immediate Next Steps

| Day | Task |
|-----|------|
| **Today** | Add Trust Badges + Disclaimer + Report Button |
| **Tomorrow** | Add UserJot + Analytics |
| **Day 3** | Create `/ramadan-deals-vancouver-2026` page |
| **Day 4-5** | Curate 20-30 Ramadan deals manually |
| **Day 6-7** | Launch + Post to Reddit/FB groups |
| **Week 2** | TikTok content + Influencer outreach |
| **Week 3** | SEO pages + Mosque outreach |
