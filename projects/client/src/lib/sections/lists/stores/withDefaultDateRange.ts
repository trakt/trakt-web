import type { FilterParams } from '$lib/requests/models/FilterParams.ts';

type DatedFilter = NonNullable<FilterParams['filter']> & {
  start_date?: string;
  end_date?: string;
};

type DefaultDateRange = {
  start?: Date;
  end?: Date;
};

type WithDefaultDateRangeParams<T extends FilterParams> = {
  params: T;
  range: DefaultDateRange;
};

export function withDefaultDateRange<T extends FilterParams>({
  params,
  range,
}: WithDefaultDateRangeParams<T>): T {
  if (params.filter?.years || params.theme) return params;

  // FIXME: remove this when behavior is uplifted to the server
  const current: DatedFilter = params.filter ?? {};
  const filter: DatedFilter = {
    ...current,
    ...(range.start && {
      start_date: current.start_date ?? range.start.toISOString(),
    }),
    ...(range.end && {
      end_date: current.end_date ?? range.end.toISOString(),
    }),
  };

  return { ...params, filter };
}
