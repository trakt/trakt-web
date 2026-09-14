export function calculateSlotMidpoint(startDate: Date, endDate: Date): Date {
  return new Date((startDate.getTime() + endDate.getTime()) / 2);
}
