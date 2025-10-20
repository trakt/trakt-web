export function isSameDayOfYear(dateA: Date, dateB: Date): boolean {
  return dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate();
}
