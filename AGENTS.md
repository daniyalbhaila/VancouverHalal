# Halal Maps (Vancouver Halal)

## 🧠 Engineering Philosophy: The 10x Mindset
**Goal**: Build a web app that feels native and is **super snappy**.
-   **Performance First**: Latency is the enemy. Every interaction must feel instant.
-   **Native Polish**: Transitions, animations, and touch interactions should rival native iOS/Android apps.
-   **Zero Friction**: Minimize clicks, anticipate user intent, and handle errors gracefully.

---

## Purpose + Product Scope
> **See [prd.md](./prd.md) for the full Product Requirement Document, Target Audience, and Roadmap.**

**Halal Maps (Vancouver Halal)** is the most **modern, visual, and trustworthy guide** to Halal dining in Vancouver.

The app provides three primary experiences (as defined in the PRD):
1.  **Explore List**: A searchable, filterable list of restaurants.
2.  **Map View**: An interactive map for spatial discovery.
3.  **Swipe Deck**: A gamified "Tinder-style" card interface.

## Architecture Overview

### System Diagram
```text
       +------+
       | User |
       +--+---+
          |
          v
+---------+------------------------------------------------+
| Client Side (Next.js)                                    |
|                                                          |
|   +------------------+       +-----------------------+   |
|   | Location Context +------>+ UI Components         |   |
|   +------------------+       | (Explore, Map, Swipe) |   |
|                              +--+-----------------+--+   |
|                                 |                 |      |
|                                 v                 v      |
|                      +----------+-------+  +------+------+
|                      |  LocalStorage    |  | Next.js     |
|                      |  (Favorites)     |  | Data Cache  |
|                      +------------------+  +------+------+
|                                                   |      |
+---------------------------------------------------|------+
                                                    |
         +------------------------------------------+
         |
         v
+--------+--------+       +----------------+
| Server Side     |       | Database       |
|                 |       |                |
| +-------------+ |       | +------------+ |
| | Supabase    +---------->+ Postgres   | |
| | REST API    | |       | | (View)     | |
| +-------------+ |       | +------------+ |
+-----------------+       +----------------+
```

-   **Framework**: Next.js App Router.
-   **Rendering**: Hybrid approach with server-side data fetching and client-side UI interactivity.
-   **Data Source**: Supabase (PostgreSQL) via a `halal_restaurants` view.

## Data Flow
1.  **Fetch**: Server components fetch data from Supabase REST API.
2.  **Transform**: Raw data is processed to derive computed fields like `isOpen` (based on current time and opening hours).
3.  **UI Consumption**: Processed data is passed to client components (List, Map, Swipe) for rendering.
4.  **Revalidation**: Data is cached and revalidated hourly to ensure freshness without overloading the database.

## State & Storage
-   **LocationContext**: A React Context that manages the user's geolocation. It caches part of the state for 5 minutes to prevent redundant browser permission prompts and recalculations.
-   **URL Params**: Used for shareable state, such as the current view (`?view=map`) or filters.
-   **LocalStorage**:
    -   `halal-favorites`: Stores the IDs of restaurants the user has favorited (liked). This is a client-side only feature.

## Map Subsystem
-   **Library**: MapLibre GL JS (via a React wrapper).
-   **Features**:
    -   Custom markers for rated restaurants.
    -   Interactive popups with restaurant details.
    -   Lazy loading of map components to improve initial page load performance.
    -   Geolocation controls to center the map on the user.

## Extension Points + Gotchas
-   **Environment Variables**: Requires `SUPABASE_URL` and `SUPABASE_ANON_KEY` to function.
-   **Location Permissions**: The app relies heavily on browser geolocation. Testing requires a context where location services are available (or mocked).
-   **Revalidation**: If data updates in Supabase aren't showing up, check the Next.js Instruction Segment revalidation time (currently set to 1 hour).
-   **Timezones**: Opening hours logic must account for the local timezone of the restaurants (Pacific Time for Vancouver).
