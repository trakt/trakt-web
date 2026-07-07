export const TV_TIME_BANNER_ID = 'tv-time';

// TV Time announced its shutdown in-app on 2026-07-01 (TechCrunch reported it
// 2026-07-02). Users who joined on/after this date are treated as migrating
// from TV Time and shown the companion-app banner.
export const TV_TIME_ANNOUNCEMENT_DATE = new Date('2026-07-01T00:00:00.000Z');

// Hard cutoff - the banner stops showing at the end of the shutdown month
// (July 2026) regardless of join date. Exclusive upper bound.
export const TV_TIME_BANNER_END = new Date('2026-08-01T00:00:00.000Z');
