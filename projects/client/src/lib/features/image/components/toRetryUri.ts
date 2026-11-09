type ToRetryUriProps = {
  current: string;
  next: string;
  fallback?: string;
};

export function toRetryUri({ current, next, fallback }: ToRetryUriProps) {
  if (fallback == null) {
    return next;
  }

  return next === '' || next === current ? fallback : next;
}
