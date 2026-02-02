# Vancouver Halal - Restaurant Discovery App

A curated discovery platform for halal restaurants in Vancouver, featuring list searching, interactive maps, and a fun swipe-to-discover interface.

## Product Overview & Features

### Core Experiences
-   **Explore**: A comprehensive list of restaurants with powerful filters (Category, Open Now) and sorting options (Recommended, Distance, Rating). Includes a radius slider to find spots nearby.
-   **Map View** (`/?view=map`): Visually explore the city's halal food scene. Pins are coded by rating, with quick-view popups and directions.
-   **Swipe Deck** (`/swipe`): Can't decide? Use the "Tinder-style" deck to swipe left or right on restaurants. Likes are automatically saved to your favorites.
-   **Saved**: Access your personal collection of favorited restaurants.

### Key Capabilities
-   **Smart Geolocation**: Uses your browser's location to calculate precise distances and show you what's nearby.
-   **Real-time Availability**: "Open Now" filters are calculated dynamically based on complex opening hours (including late-night spots open past midnight).
-   **Local Favorites**: Your saved restaurants are stored privately on your device.

## Local Development Setup

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd web
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or yarn install / pnpm install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root directory. You will need Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the app.

## Data Source & Refresh Behavior

-   **Source**: Data is sourced from a Supabase PostgreSQL database (specifically the `halal_restaurants` view).
-   **Caching**: To optimize performance, data is fetched server-side and cached.
-   **Revalidation**: The app revalidates data every **1 hour**. Changes made in the database will appear in the app after this cache period expires.

## Deployment Notes

-   **Platform**: Designed for seamless deployment on Vercel or Netlify.
-   **Build Command**: `npm run build`
-   **Environment**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in your deployment platform's environment variables.

## Troubleshooting

-   **"Location not found"**: Ensure your browser has granted location permissions to the site. The app defaults to a fallback location if permission is denied.
-   **Map visuals missing**: Check developer tools console for MapLibre errors; ensure your network isn't blocking map tile requests.
-   **Data looks old**: If you just updated the database, wait for the 1-hour revalidation window or manually rebuild the site to clear the cache.
