import { goto } from '$app/navigation';
import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { onMount } from 'svelte';
import { UrlBuilder } from '../../../utils/url/UrlBuilder.ts';
import { useShare } from '../../buttons/share/useShare.ts';

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
} | {
  type: 'homeNavigation';
} | {
  type: 'scrollToSection';
  y: number;
} | {
  type: 'embeddedShare';
  title: string;
  url: string;
  text: string;
};

type FrameListenerProps = {
  slug: string;
  source: string;
};

export function frameListener(
  element: HTMLIFrameElement,
  { slug, source }: FrameListenerProps,
) {
  const { share } = useShare({ id: source });

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

    if (event.data.type === 'homeNavigation') {
      goto(UrlBuilder.home(), {
        replaceState: true,
      });
    }

    if (event.data.type === 'scrollToSection') {
      globalThis.window.scrollTo({
        top: event.data.y,
      });
    }

    if (event.data.type === 'embeddedShare') {
      const data = {
        title: event.data.title,
        url: event.data.url,
        text: event.data.text,
      };
      share(data);
    }
  };

  globalThis.window.addEventListener('message', handleMessage);

  const postMessageToChild = <T>(message: T) => {
    VALID_ORIGINS.forEach((origin) => {
      element.contentWindow?.postMessage(message, origin);
    });
  };

  onMount(() => {
    const sendScrollToChild = () => {
      postMessageToChild({
        type: 'parentScrollY',
        scrollY: globalThis.window.scrollY,
      });
    };
    const sendHeightToChild = () => {
      postMessageToChild({
        type: 'parentClientHeight',
        height: globalThis.document.body.clientHeight,
      });
    };

    element.addEventListener('load', sendHeightToChild);

    const unregister = GlobalEventBus
      .getInstance()
      .register('resize', sendHeightToChild);

    const unregisterScroll = GlobalEventBus
      .getInstance()
      .register('scroll', sendScrollToChild);

    return () => {
      element.removeEventListener('load', sendHeightToChild);
      unregister();
      unregisterScroll();
    };
  });

  return {
    destroy() {
      globalThis.window.removeEventListener('message', handleMessage);
    },
  };
}
