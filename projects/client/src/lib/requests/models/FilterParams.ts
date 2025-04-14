export type FilterParams = DeepPartial<{
  filter: {
    /*
      FIXME:
      -split up and have strongly typed key/value pairs
      -update defineQuery to deal with object dependencies
    */
    genres: string;
    watch_window: number;
  };
}>;
