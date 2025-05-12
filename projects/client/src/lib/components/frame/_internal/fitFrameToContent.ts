import { error } from '$lib/utils/console/print.ts';

export function fitFrameToContent(element: HTMLIFrameElement) {
  const fitContent = () => {
    const height =
      element.contentWindow?.document.documentElement.scrollHeight ?? 0;
    element.style.height = `${height}px`;
  };

  const observer = new MutationObserver(fitContent);

  const handleLoad = () => {
    if (!element.contentWindow) {
      return;
    }

    try {
      fitContent();

      observer.observe(element.contentWindow.document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    } catch (e) {
      error('Could not fit frame to content:', e);
    }
  };

  element.addEventListener('load', handleLoad);

  return {
    destroy() {
      observer.disconnect();
      element.removeEventListener('load', handleLoad);
    },
  };
}
