export function retryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 30000);
}
