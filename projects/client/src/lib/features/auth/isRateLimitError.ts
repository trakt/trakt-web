const rateLimitPattern = /\b429\b/;

export function isRateLimitError(error: unknown): boolean {
  return error instanceof Error && rateLimitPattern.test(error.message);
}
