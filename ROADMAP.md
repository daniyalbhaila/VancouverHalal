# Strategic Roadmap: Dineout (Vancouver Halal)

## Strategy Overview
We are building the **trust layer** for Halal dining. Unlike Google Maps (broad data), we win by providing **specific context** (alcohol policy, hand-slaughtered status) and **community verification**.

---

## 🟢 Phase 1: Pre-Launch (Hybrid Data Strategy)
**Focus**: Seed Data + Community Intake.
**Goal**: The app has enough "good stuff" to be useful, but invites users to build the rest.
**Exit Criteria**: 50 Seeded Listings + 10 User Submissions.

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
- [ ] **Basic SEO**:
    - Programmatic pages for "Best Halal Burgers Vancouver", etc.

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
- [ ] **Data Products**:
    - Selling "Halal Trend Reports" to restaurant suppliers.

---

## Immediate Next Steps (To Enter Phase 1)
1.  **Tech**: Set up Python Pipeline with API Keys to fix the "Empty Images" issue.
2.  **Product**: Define the "Halal Policy" attributes (Strict vs Flexible) in the database.
3.  **Content**: Seed the top 50 restaurants with manual TikTok links.
