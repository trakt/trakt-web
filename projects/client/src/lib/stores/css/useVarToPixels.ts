import { browser } from '$app/environment';
import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { BehaviorSubject } from 'rxjs';
import { onDestroy } from 'svelte';

const cache = {
  div: null as HTMLDivElement | Nil,
  isSetup: false,
};

function setup() {
  if (cache.isSetup) {
    return assertDefined(cache.div, 'Pixel measurement div not defined');
  }

  cache.isSetup = true;
  cache.div = document.createElement('div');
  document.body.appendChild(cache.div);

  const { div } = cache;
  div.style.position = 'absolute';
  div.style.left = '-9999px';
  div.style.top = '-9999px';
  div.style.visibility = 'hidden';
  div.style.pointerEvents = 'none';

  return div;
}

function calculate(value: string) {
  const pixelMeasurementDiv = setup();

  pixelMeasurementDiv.style.width = value;

  return pixelMeasurementDiv.getBoundingClientRect().width;
}

export function useVarToPixels(variable: string, isStable = true) {
  const value = new BehaviorSubject(0);

  if (!browser) return value.asObservable();

  value.next(calculate(variable));

  if (isStable) return value.asObservable();

  const destroy = GlobalEventBus.getInstance().register(
    'resize',
    () => value.next(calculate(variable)),
  );

  onDestroy(destroy);

  return value.asObservable();
}
