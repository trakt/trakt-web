// Brand names are not localized, so this is a plain lookup rather than an i18n
// message map. Only multi-word / stylized brands need an override; the rest
// title-case from their slug.
const SYNC_SOURCE_NAMES: Readonly<Record<string, string>> = {
  appletv: 'Apple TV',
  tvtime: 'TV Time',
  imdb: 'IMDb',
  hbomax: 'HBO Max',
};

export function toSyncSourceName(source: string): string {
  const key = source.trim().toLowerCase();
  if (key.length === 0) {
    return source;
  }

  const known = SYNC_SOURCE_NAMES[key];
  if (known) {
    return known;
  }

  return key
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
