/**
 * SEO-friendly URL slug utilities for restaurant pages
 */

/**
 * Generate a URL-safe slug from a restaurant name
 * Always appends last 4 chars of ID for uniqueness
 * Example: "Caveman Café & Bakery" + "05c00524-413c-4f6e-8316-58f23c0586a7"
 *       -> "caveman-cafe-bakery-86a7"
 */
export function generateSlug(name: string, id: string): string {
    const base = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 50); // Limit length

    const shortId = id.slice(-4);
    return `${base}-${shortId}`;
}

/**
 * Extract the short ID (last 4 chars of UUID) from a slug
 * Example: "caveman-cafe-bakery-86a7" -> "86a7"
 */
export function extractShortIdFromSlug(slug: string): string | null {
    const match = slug.match(/-([a-f0-9]{4})$/);
    return match ? match[1] : null;
}
