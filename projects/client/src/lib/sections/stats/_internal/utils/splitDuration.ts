export function splitDuration(duration: string): string[] {
  return duration.match(/\d+\s*\p{L}+/gu) ?? [duration];
}
