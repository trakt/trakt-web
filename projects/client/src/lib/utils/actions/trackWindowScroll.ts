import { onMount } from 'svelte';
import { GlobalEventBus } from '../events/GlobalEventBus.ts';

export function trackWindowScroll(node: HTMLElement, className: string) {
  function handleScroll() {
    const isScrolled = globalThis.window.scrollY > 0;
    node.classList.toggle(className, isScrolled);
  }

  onMount(() => {
    handleScroll();

    return GlobalEventBus.getInstance().register('scroll', handleScroll);
  });
}
