const SHARE_ARRIVAL_TYPE_BY_ROUTE: Readonly<Record<string, string>> = {
  '/movies/[slug]': 'movie',
  '/shows/[slug]': 'show',
  '/shows/[slug]/seasons/[season]': 'season',
  '/shows/[slug]/seasons/[season]/episodes/[episode]': 'episode',
  '/people/[slug]': 'person',
  '/users/[user]/lists/[list]': 'list',
  '/lists/official/[list]': 'list',
};

export function toShareArrivalType(route: string | null): string {
  return (route && SHARE_ARRIVAL_TYPE_BY_ROUTE[route]) ?? 'other';
}
