export const time = {
  seconds: (s: number) => s * 1000,
  minutes: (m: number) => time.seconds(m * 60),
  hours: (h: number) => time.minutes(h * 60),
  days: (d: number) => time.hours(d * 24),
  weeks: (w: number) => time.days(w * 7),
  months: (m: number) => time.days(30 * m),
  years: (y: number) => time.days(365 * y),
  fps: (fps: number) => time.seconds(1) / fps,
};
