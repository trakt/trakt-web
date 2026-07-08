export const TV_TIME_IMPORT_BANNER_ID = 'tv-time-import-v2';

// The improved TV Time importer (show + season/episode resolution) shipped on
// this date. Users who joined between the shutdown announcement
// (TV_TIME_ANNOUNCEMENT_DATE) and this release imported with the previous
// version and may have missing show/episode data, so they are prompted to
// re-import. Exclusive upper bound on join date - align with the actual deploy.
export const TV_TIME_IMPORT_V2_RELEASE_DATE = new Date(
  '2026-07-08T00:00:00.000Z',
);

// Hard cutoff - the banner retires at the end of the shutdown month regardless
// of join date. Exclusive upper bound.
export const TV_TIME_IMPORT_BANNER_END = new Date('2026-08-01T00:00:00.000Z');
