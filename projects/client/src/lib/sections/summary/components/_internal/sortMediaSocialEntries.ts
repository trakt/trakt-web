import type { MediaSocial } from '$lib/requests/models/MediaSocial.ts';

function hasRating(entry: MediaSocial) {
  return entry.watched?.rating != null;
}

function watchlistedValue(entry: MediaSocial) {
  return entry.watchlisted == null ? 0 : 1;
}

function watchedPlays(entry: MediaSocial) {
  return entry.watched?.plays ?? 0;
}

function dateValue(date: Date | null | undefined) {
  return date?.getTime() ?? 0;
}

function lastActivityDate(entry: MediaSocial) {
  return Math.max(
    dateValue(entry.watched?.rating?.ratedAt),
    dateValue(entry.watched?.comment?.updatedAt),
    dateValue(entry.watched?.comment?.createdAt),
    dateValue(entry.watched?.lastUpdatedAt),
    dateValue(entry.watched?.lastWatchedAt),
    dateValue(entry.watchlisted?.listedAt),
  );
}

function compareDescending(a: number, b: number) {
  return b - a;
}

function compareSocialEntry(a: MediaSocial, b: MediaSocial) {
  return (
    compareDescending(Number(hasRating(a)), Number(hasRating(b))) ||
    compareDescending(watchedPlays(a), watchedPlays(b)) ||
    compareDescending(watchlistedValue(a), watchlistedValue(b)) ||
    compareDescending(lastActivityDate(a), lastActivityDate(b)) ||
    a.user.username.localeCompare(b.user.username)
  );
}

export function sortMediaSocialEntries(entries: MediaSocial[]) {
  return [...entries].sort(compareSocialEntry);
}
