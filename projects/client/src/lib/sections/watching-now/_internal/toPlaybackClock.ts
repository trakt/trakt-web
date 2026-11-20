const pad = (value: number) => String(value).padStart(2, '0');

export function toPlaybackClock(milliseconds: number): string {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours === 0) return `${minutes}:${pad(seconds)}`;

  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}
