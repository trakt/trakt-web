import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const cache = {
  div: null as HTMLDivElement | Nil,
  isSetup: false,
};

function setup() {
  if (cache.isSetup) return cache.div!;

  cache.isSetup = true;
  cache.div = document.createElement('div');
  document.body.appendChild(cache.div);

  const { div } = cache;
  div.style.position = 'absolute';
  div.style.left = '-9999px';
  div.style.top = '-9999px';
  div.style.visibility = 'hidden';
  div.style.pointerEvents = 'none';

  return cache.div!;
}

function calculate(value: string) {
  const pixelMeasurementDiv = setup();

  pixelMeasurementDiv.style.width = value;

  return pixelMeasurementDiv.getBoundingClientRect().width;
}

const STABLE = [
  'px',
  'pt',
  'cm',
  'mm',
  'in',
  'pc',
];

export function useVarToPixels(variable: string) {
  const value = writable(0);

  if (!browser) return value;

  value.set(calculate(variable));

  const isStable = STABLE.some((unit) => variable.includes(unit));

  if (isStable) return value;

  globalThis.addEventListener('resize', () => value.set(calculate(variable)));

  return value;
}
