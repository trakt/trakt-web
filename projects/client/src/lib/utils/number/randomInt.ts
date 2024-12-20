import { random } from '$lib/utils/number/random.ts';

export function randomInt(min: number, max: number) {
  return Math.floor(random(min, max));
}
