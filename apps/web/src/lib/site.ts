export const SITE_NAME = "Discover Qellem";

export const SITE_DESCRIPTION =
  "Discover Kellem Wollega (Qeellam Wallaggaa) — verified facts, stories, places and people of the twelve woredas and towns.";

// Override with NEXT_PUBLIC_SITE_URL at deploy time if the domain changes.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://discoverqellem.org";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path}`;
}
