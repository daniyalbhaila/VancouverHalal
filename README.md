# Halal Maps

Discover top-rated halal restaurants in Vancouver. Halal Maps is a mobile-first discovery experience with list, map, swipe, and saved flows. The current city instance is branded as Vancouver Halal.

## Highlights
- Explore curated halal restaurants with filters for category, open-now, radius, and sort.
- Map view with ratings-based markers, popups, and directions.
- Swipe deck to quickly like or skip restaurants.
- Saved list stored locally on the device.
- Hourly data refresh from Supabase.

## Product Routes
- `/` Explore list (Vancouver Halal)
- `/?view=map` Map view
- `/swipe` Swipe deck
- `/saved` Saved favorites

## Tech Stack
- Next.js App Router (server components for data fetch, client components for interactivity)
- Supabase REST API for restaurant data
- MapLibre GL for mapping
- Tailwind CSS for styling

## Getting Started
1. Install dependencies

```bash
npm install
```

2. Set environment variables

Create a `.env.local` file with:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000.

## Data Source
Restaurant data is fetched from a Supabase view/table named `halal_restaurants` via REST and transformed in `lib/data.ts`. The app filters out closed locations and computes open-now using Google-style opening hours data.

## Caching
Pages use `revalidate = 3600` (hourly). Location is cached in localStorage for 5 minutes to reduce prompts.

## Troubleshooting
- Missing env vars: the app will throw if `SUPABASE_URL` or `SUPABASE_ANON_KEY` are not set.
- Location issues: ensure your browser allows geolocation for accurate distance sorting and radius filtering.

## Deployment Notes
The app is compatible with standard Next.js hosting (Vercel, Netlify, etc.). Ensure env vars are configured in the deployment environment.
