import { time } from '$lib/utils/timing/time.ts';

export const SNOW_CONFIG = {
  icons: ['❆', '❅', '❄'],
  minScale: 0.4,
  windForce: 0.25,
  count: 75,
  duration: time.seconds(20),
  melting: {
    delay: time.seconds(1),
    duration: time.seconds(4),
  },
} as const;
