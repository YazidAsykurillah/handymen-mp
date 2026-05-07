/**
 * Slug utilities for converting between human-readable slugs and database IDs.
 * Used primarily for SEO-friendly URL parameters (e.g. ?province=jawa-tengah).
 */

interface SlugItem {
  id: number;
  name: string;
}

/**
 * Convert a display name into a URL-safe slug.
 * @example slugify("Jawa Tengah") => "jawa-tengah"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

/**
 * Find an item's ID by matching its slugified name against a given slug.
 * Returns the ID as a string, or the provided fallback (default "all").
 */
export function getIdFromSlug<T extends SlugItem>(
  items: T[],
  slug: string | null,
  fallback: string = "all"
): string {
  if (!slug) return fallback;
  const match = items.find((item) => slugify(item.name) === slug.toLowerCase());
  return match ? match.id.toString() : fallback;
}

/**
 * Find an item's slug by its ID.
 * Returns the slugified name, or null if not found.
 */
export function getSlugFromId<T extends SlugItem>(
  items: T[],
  id: string
): string | null {
  if (id === "all") return null;
  const match = items.find((item) => item.id.toString() === id);
  return match ? slugify(match.name) : null;
}
