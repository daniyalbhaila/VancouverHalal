# Restaurant Details Page - Future Improvements

> This document tracks future enhancements for the Restaurant Details Page that will increase trust, engagement, and value for halal-conscious diners.

---

## 🔴 High Priority (Phase 1.5)

### Halal Verification Badge
**Goal**: Build trust by showing halal certification status.
- [ ] Add `halal_status` field to database: `verified`, `reported`, `unknown`
- [ ] Display badge on details page and discovery cards
- [ ] Consider: manual curation vs. community-reported

### "What People Say" Section
**Goal**: Surface key insights from reviews without requiring users to leave the app.
- [ ] Fetch Google reviews via Places API (or cache in DB)
- [ ] Use LLM to generate 2-3 sentence summary of reviews
- [ ] Show 3 highlighted quotes with sentiment indicators
- [ ] Example: *"Great lamb biryani, friendly staff, but can get crowded on weekends."*

---

## 🟠 Medium Priority (Phase 2)

### Photo Gallery
- [ ] Fetch additional photos from Google Places
- [ ] Horizontal scroll gallery below hero
- [ ] Tap to open fullscreen viewer

### Menu Highlights
- [ ] Scrape or manually add popular dishes
- [ ] Display with prices if available
- [ ] Show "Popular" or "Staff Pick" badges

### Alcohol Indicator
- [ ] Add `serves_alcohol` boolean to database
- [ ] Show discrete indicator for users who prefer alcohol-free venues

---

## 🟢 Nice to Have (Phase 3)

### Family-Friendly Badge
- [ ] Add `family_friendly` field
- [ ] Show kid-chair, high-chair availability

### Accessibility Info
- [ ] Extract from Google Places (wheelchair accessible, etc.)
- [ ] Display as icons in header

### Nearby Mosques/Prayer Spaces
- [ ] Show distance to nearest masjid
- [ ] Helpful for travelers

---

## 🎬 Transition & Motion Improvements

### View Transitions API (Quick Win)
- [ ] Enable browser-native page transitions
- [ ] Details page slides in from right, back slides out left
- [ ] Single Next.js config change

### Shared Element Transition for Hero
- [ ] Hero image "morphs" from card position to full-width
- [ ] Requires Framer Motion `layoutId`
- [ ] Very "native" but needs careful implementation

### Standardize Animation Timing
- [ ] All enter animations: 200-300ms
- [ ] Consistent easing curve across app
- [ ] Keep Framer Motion for gestures only

---

## Data Requirements Summary

| Feature | Database Field | Source |
|---------|----------------|--------|
| Halal Badge | `halal_status` | Manual / Community |
| Reviews Summary | `reviews_summary` | LLM-generated |
| Photo Gallery | `additional_photos[]` | Google Places |
| Menu Highlights | `menu_items[]` | Manual / Scraping |
| Alcohol | `serves_alcohol` | Manual |
| Family-Friendly | `family_friendly` | Manual |
