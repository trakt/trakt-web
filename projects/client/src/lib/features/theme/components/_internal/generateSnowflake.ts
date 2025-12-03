import { shuffle } from '$lib/utils/array/shuffle.ts';
import { SNOW_CONFIG } from './constants/index.ts';
import type { Snowflake } from './models/Snowflake.ts';

export function generateSnowflake(isVisible?: boolean): Snowflake {
  const scale = SNOW_CONFIG.minScale +
    Math.random() * (1 - SNOW_CONFIG.minScale);
  const xStart = Math.random() * (1 + SNOW_CONFIG.windForce) -
    SNOW_CONFIG.windForce;

  return {
    scale,
    xStart,
    isVisible: isVisible ?? false,
    delay: Math.random() * SNOW_CONFIG.duration,
    duration: (1 + SNOW_CONFIG.minScale - scale) * SNOW_CONFIG.duration,
    xEnd: xStart + scale * SNOW_CONFIG.windForce,
    snowIcon: shuffle(SNOW_CONFIG.icons).at(0) ?? '❄',
  };
}
