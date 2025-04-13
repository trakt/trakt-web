import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { onMount } from 'svelte';
import { focusSomething } from './focusSomething.ts';
import { handleItemNavigation } from './handleItemNavigation.ts';
import { handleListNavigation } from './handleListNavigation.ts';

const handler = (ev: KeyboardEvent) => {
  switch (ev.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'ArrowDown':
    case 'ArrowRight':
      focusSomething();
      ev.preventDefault();
      break;
  }

  switch (ev.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      handleItemNavigation(ev.key);
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      handleListNavigation(ev.key);
      break;
  }
};

export function dpadController(_: HTMLElement) {
  onMount(() => {
    focusSomething();

    const destroy = GlobalEventBus.getInstance().register('keydown', handler);

    return {
      destroy,
    };
  });
}
