export function getYearInReviewYear(date: Date): number {
  const isEarlyYear = date.getMonth() <= 1; // January (0) or February (1)
  return isEarlyYear ? date.getFullYear() - 1 : date.getFullYear();
}
