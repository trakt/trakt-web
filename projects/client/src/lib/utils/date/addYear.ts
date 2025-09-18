export function addYear(date: Date, offset: number): Date {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + offset);
  return newDate;
}
