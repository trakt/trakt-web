// fetch rejects with a TypeError when the network is unreachable; HTTP error
// statuses resolve normally, so this only matches true connectivity failures.
export function isNetworkError(candidate: unknown): boolean {
  return candidate instanceof TypeError;
}
