/*
  The page region a filter is meaningful on. Filters are shared globally across
  every surface that opts into `hasFilters`, so a filter that only maps onto one
  feed (e.g. episode roles, which exist on the calendar and nowhere else) names
  its surfaces to stay out of the others.
*/
export type FilterSurface = 'calendar';
