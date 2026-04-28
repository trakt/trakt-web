export type PeakHoursData = {
  readonly buckets: ReadonlyArray<
    { readonly label: string; readonly count: number }
  >;
};
