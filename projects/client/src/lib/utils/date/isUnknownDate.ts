export function isUnknownDate(date: Date): boolean {
  return date.getUTCFullYear() === 1970 &&
    date.getUTCMonth() === 0 &&
    date.getUTCDate() === 1;
}
