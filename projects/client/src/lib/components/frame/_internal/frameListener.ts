import { goto } from '$app/navigation';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { UrlBuilder } from '$lib/utils/url/UrlBuilder.ts';
import { onMount } from 'svelte';

const VALID_ORIGINS: string[] = [
  'https://trakt.tv',
  'http://localhost:3000',
] as const;

type FrameMessage = {
  type: 'embeddedHeight';
  height: number;
} | {
  type: 'embeddedNavigation';
  pathname: string;
};

export function frameListener(element: HTMLIFrameElement, slug: string) {
  const handleMessage = (event: MessageEvent<FrameMessage>) => {
    if (!VALID_ORIGINS.includes(event.origin)) {
      return;
    }

    if (event.data.type === 'embeddedHeight') {
      const height = event.data.height;
      element.style.height = `${height}px`;
    }

    if (event.data.type === 'embeddedNavigation') {
      const path = event.data.pathname === '/'
        ? UrlBuilder.profile.user(slug)
        : event.data.pathname;

      goto(path);
    }
  };

  globalThis.window.addEventListener('message', handleMessage);

  onMount(() => {
    const sendHeightToChild = () => {
      VALID_ORIGINS.forEach((origin) => {
        element.contentWindow?.postMessage({
          type: 'parentClientHeight',
          height: globalThis.document.body.clientHeight,
        }, origin);
      });
    };

    element.addEventListener('load', sendHeightToChild);

    const unregister = GlobalEventBus
      .getInstance()
      .register('resize', sendHeightToChild);

    return () => {
      element.removeEventListener('load', sendHeightToChild);
      unregister();
    };
  });

  return {
    destroy() {
      globalThis.window.removeEventListener('message', handleMessage);
    },
  };
}
