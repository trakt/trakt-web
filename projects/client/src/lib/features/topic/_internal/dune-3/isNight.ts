export function isNight(date: Date) {
  const hour = date.getHours();
  return hour >= 19 || hour < 6;
}
