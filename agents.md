# Halal Maps Agents Guide

## Product Intent
Halal Maps helps users discover halal restaurants quickly. The current city instance is Vancouver Halal, focused on high-quality, nearby spots with clear open/closed status and fast navigation to directions.

Core experiences:
- Explore list with filters (category, open-now, radius) and sort (recommended, distance, rating).
- Map view with rated markers, labels, and popups.
- Swipe deck for fast like/skip decisions.
- Saved list stored locally on device.

## Architecture Overview
- Next.js App Router with server components fetching data and client components handling interactivity.
- Supabase REST API is the only external data dependency.
- Location is provided via a client-only context and cached in localStorage.
- MapLibre GL is wrapped in a custom UI layer for markers, popups, and controls.

### Simple Architecture Diagram
```
User
  │
  ▼
Next.js App Router
  │  Server components
  │  - app/page.tsx
  │  - app/swipe/page.tsx
  │  - app/saved/page.tsx
  ▼
lib/data.ts (fetch + normalize)
  │
  ▼
Supabase REST (halal_restaurants)
  │
  ▼
Client components
  - HomeClient (filters/sort)
  - Map (MapLibre UI)
  - SwipeDeck (swipe/favorites)
  - SavedClient
  │
  ▼
Local Storage + Location Context
```

### Server and Client Boundaries
- Server pages: `app/page.tsx`, `app/swipe/page.tsx`, `app/saved/page.tsx` fetch data with `getDiscoveryRestaurants()`.
- Client UI: filters, swipe interactions, map rendering, and favorites live in client components.

## Data Flow
1. `lib/data.ts` fetches `halal_restaurants` from Supabase REST.
2. Records are normalized into `RestaurantCard` and filtered for valid names.
3. Open-now is derived from opening hours periods (Vancouver timezone).
4. Client components add distance when geolocation is available.
5. UI filters and sorts are applied on the client.

## State and Storage
- Location: `context/LocationContext.tsx`, cached in `localStorage` for 5 minutes.
- Favorites: `hooks/useFavorites.ts` uses localStorage key `halal-favorites`.
- View: map vs list controlled by `view` query param.

## Map Subsystem
- `components/ui/map.tsx` wraps MapLibre with a safe React API (Map, MapMarker, MarkerPopup, MapControls).
- `components/Map.tsx` uses the wrapper to render restaurant markers, labels, popups, and user location.
- The map is client-only and lazy loaded via `next/dynamic`.

## Key Files
- `app/page.tsx` Explore entry + server fetch
- `components/HomeClient.tsx` list view logic, filters, sorting
- `components/Map.tsx` map experience
- `components/SwipeDeck.tsx` swipe interactions + favorites
- `components/SavedClient.tsx` saved list UI
- `lib/data.ts` Supabase fetch + normalization + open-now logic
- `lib/restaurants.ts` distance enrichment
- `context/LocationContext.tsx` geolocation state

## Extension Points
- Add new cities: new routes + city-specific metadata; reuse the same data pipeline.
- Monetization: featured listings, sponsored cards, or affiliate links in cards and map popups.
- Map styling: customize styles in `components/ui/map.tsx`.
- Categories: update `components/CategoryFilter.tsx` and ensure data categories align.

## Operational Notes
- Required env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
- Revalidate is set to 3600 seconds for pages.
- Geolocation permissions affect distance features; app still works without location.
