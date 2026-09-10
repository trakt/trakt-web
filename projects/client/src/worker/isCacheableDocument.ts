export function isCacheableDocument(
  response: { status: number; redirected: boolean },
): boolean {
  return response.status === 200 && !response.redirected;
}
