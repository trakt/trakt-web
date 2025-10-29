type FilterParam = {
  /*
      FIXME:
      -split up and have strongly typed key/value pairs
      -update defineQuery to deal with object dependencies
    */
  genres: string;
  subgenres: string;
  years: string;
  ignore_watched: boolean;
  ignore_watchlisted: boolean;
  watch_window: number;
};

export type FilterOverrideParams = DeepPartial<{
  movie?: FilterParam;
  show?: FilterParam;
}>;

export type FilterParams = DeepPartial<{
  filter: FilterParam;
  filterOverride?: FilterOverrideParams;
}>;
