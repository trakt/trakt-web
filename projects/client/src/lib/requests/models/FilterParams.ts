export type FilterParams = DeepPartial<{
  filter: {
    /*
      FIXME:
      -split up and have strongly typed key/value pairs
      -update defineQuery to deal with object dependencies
    */
    genres: string;
    ignore_watched: boolean;
    ignore_watchlisted: boolean;
    watch_window: number;
    min_year: number;
  };
}>;
