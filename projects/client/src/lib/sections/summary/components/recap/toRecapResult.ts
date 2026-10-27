type RecapQueryState<T> = {
  isLoading: boolean;
  data?: T | null;
};

export function toRecapResult<T>({ isLoading, data }: RecapQueryState<T>) {
  return isLoading ? undefined : (data ?? null);
}
