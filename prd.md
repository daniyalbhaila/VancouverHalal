# Product Requirement Document (PRD) & Strategy

## 1. Product Overview (Current State)
- **Product**: Halal Maps (Vancouver Halal)
- **Value Prop**: The most modern, visual, and trustworthy guide to Halal dining in Vancouver.
- **Platform**: Mobile-first Web App (PWA capable).

### Current Feature Set (Proto-MVP)
- **Discovery**: List & Map view of verified Halal restaurants.
- **Decision**: "Swipe" mode (Tinder for food) to gamify choice.
- **Filters**: Category (Burgers, Indian, etc.), Radius, "Open Now".
- **Utility**: "Saved" list (Local Storage).

## 2. Target Audience (Who are we building for?)
Understanding the three distinct types of users in our ecosystem.

### A. The "Designated Planner" (Primary)
- **Profile**: Gen Z / Millennial (20-35). The friend who organizes distinct dinners.
- **Pain Point**: "I need a place that is Halal, has good aesthetics for Instagram, and is open late."
- **Behavior**: Uses filters heavily, shares links in group chats, cares about "vibe".

### B. The "Unsure Browser"
- **Profile**: Couples or Solo diners.
- **Pain Point**: "We always go to the same 3 places. We want something new but don't want to risk a bad meal."
- **Behavior**: Uses "Swipe" feature, relies on "Trending" or "Top Rated" lists.

### C. The "Strict Diner" (Niche but Loyal)
- **Profile**: Families or individuals with strict dietary restrictions (No Alcohol, HMA/HMS verified).
- **Pain Point**: "Most 'Halal' apps don't tell me if they serve alcohol or if the meat source is verified."
- **Behavior**: Checks "Details" page specifically for attributes (alcohol-free, prayer space).

## 3. Monetization Strategy
How we turn traffic into revenue.

### Immediate (Low Friction)
- **Affiliate Lead Gen**: "Order on UberEats" / "Reserve on OpenTable" buttons on the details page. Earn $ per conversion.
- **Sponsored Listings**: "Featured" badge for restaurants to appear at top of list/search. ($50-$200/mo).

### Long Term (High Value)
- **B2B Data**: Selling aggregate trends ("Most searched cuisine in Surrey") to suppliers/new restauranteurs.
- **Premium User Tier**: "Dineout Gold" – Exclusive discounts/perks at partner restaurants (Digital Coupon Book).

## 4. Go-to-Market (Acquiring First 1000 Users)
**Strategy**: "Come for the Utility, Stay for the Content."

### The "Hidden Gem" Campaign (Social)
- Create 15-30s TikTok/Reels showcasing "Top 5 Hidden Halal Spots in Vancouver" using our app's visual polish.
- **Call to Action**: "Link in bio to find more."

### "Suggest a Spot" (Crowdsourcing)
- Reach out to local food bloggers/influencers. "We built this for the community. Is your favorite spot missing? Add it here."
- **Gamification**: "Top Contributor" leaderboard.

### SEO Programmatic Pages
- Auto-generate pages for "Best Halal Burger in [City]", "Late Night Halal [City]". Catch search traffic from Google.

## 5. Feature Roadmap to Launch

### Phase 1: Community & Data (Next 2 Weeks)
**Goal**: Fill data gaps and create a feedback loop.
- [ ] **Suggest a Spot (Crowdsourcing)**: Fab button to submit new places.
- [x] **Restaurant Details Page**: Dedicated URL for every restaurant (SEO baseline).
- [ ] **Basic Auth (Supabase)**: Move "Saved" from local storage to Cloud so it persists.

### Phase 2: Engagement (Launch Ready)
**Goal**: Make the app useful enough to share.
- [ ] **Search Bar**: Global search for specific names/locations.
- [ ] **Shareable Links**: nicely formatted OG images when sharing a restaurant link.
- [ ] **Analytics**: PostHog/Google Analytics to track what people search for.

### Phase 3: Growth (Post-Launch)
**Goal**: Retention and Revenue.
- [ ] **User Reviews/Photos**: Community validation.
- [ ] **Curated Collections**: "Date Night", "Cheap Eats", "cheat Day".
- [ ] **Monetization Integration**: "Featured" slots and Affiliate links.
