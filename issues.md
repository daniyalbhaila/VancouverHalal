# Issue Tracker

## High Priority
- [ ] **Refresh stale images (2026-09-14)**: Many `image_url` values are dead Google Photo references — the `gps-cs-s/...` URL format specifically returns 403 (checked live on production, confirmed via network requests on `/best-halal-restaurants-in-downtown-vancouver`). `RestaurantImage` now falls back to a placeholder instead of showing broken-image/alt-text overlap, so the UI doesn't look broken anymore, but the underlying photo data still needs re-fetching from Google for every restaurant with a `gps-cs-s` URL.
- [ ] **Refresh + expand restaurant data (2026-09-14)**: Supabase data is old. Two curated Google Maps shared lists were checked as sources — "Halal Restaurants - Vancouver BC" (270 places, Muhammed Suhel Kadva) and "Halal Restaurants" (300 places, Halal Foodies Vancouver / VancouverFoodies.ca). A partial manual parse of the second list (~half — Maps lazy-loads the rest on scroll, so this is not the full 300) found 19 real, currently-open restaurants not in Supabase at all, incl. The Zaiqa Restaurant (4,597 reviews) and Khan Sahab Kitchen (4.8★, directly matches a live GSC query with 34 impressions/0 clicks because no page exists for it) — see `docs/imports/halal-foodies-vancouver-partial-parse-2026-09-14.csv`. Re-open both Maps lists (linked from Recents in Google Maps, or re-share from the original owners if lost) to finish the parse before enriching. This is the natural trigger to finally set up the **Google Data Pipeline** item below rather than parsing HTML by hand again.

## Features / Enhancements (Phase 1-2)
- [ ] **Google Data Pipeline**: Setup `enrich_google_places.py` (Need API Keys).
- [ ] **Halal Schema**: Add `alcohol_policy`, `kitchen_practice` to Supabase.
- [ ] **Suggest a Spot**: UI for user submissions.
- [ ] **UserJot Integration**: Add feedback widget.
- [ ] **Review Summaries**: Display AI summaries on restaurant cards.

## Bugs
