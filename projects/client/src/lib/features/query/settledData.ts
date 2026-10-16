import { isQuerySettled } from './isQuerySettled.ts';

export function settledData<TData>(
  query: Parameters<typeof isQuerySettled>[0] & { data?: TData },
) {
  return isQuerySettled(query) ? query.data : null;
}
