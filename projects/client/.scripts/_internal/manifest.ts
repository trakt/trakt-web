/**
 * Release manifest naming for the immutable-asset R2 bucket. One manifest
 * per deploy, key is the ISO timestamp plus the release SHA. Lex-sortable
 * by time so list-and-slice works without parsing every key.
 */

export const RELEASE_MANIFEST_PREFIX = 'releases/';
export const IMMUTABLE_PREFIX = '_app/immutable/';

export type ReleaseManifest = {
  sha: string;
  uploadedAt: string;
  keys: string[];
};

export function manifestKeyFor(sha: string, now: Date = new Date()): string {
  const iso = now.toISOString().replace(/[:.]/g, '-');
  return `${RELEASE_MANIFEST_PREFIX}${iso}_${sha}.json`;
}

/**
 * Reverse of {@link manifestKeyFor}. Returns `null` if the key does not
 * match the expected `releases/<ISO-flattened>_<sha>.json` shape, which
 * keeps stray objects (manual uploads, partial writes) from being treated
 * as deploys when computing retention.
 */
export function manifestKeyToDate(key: string): Date | null {
  const stem = key
    .replace(new RegExp(`^${RELEASE_MANIFEST_PREFIX}`), '')
    .replace(/\.json$/, '');
  const [encodedIso] = stem.split('_');
  if (!encodedIso) return null;

  // encodedIso shape: YYYY-MM-DDTHH-MM-SS-mmmZ
  const match = encodedIso.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z$/,
  );
  if (!match) return null;
  const [, datePart, hh, mm, ss, ms] = match;
  const iso = `${datePart}T${hh}:${mm}:${ss}.${ms}Z`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}
