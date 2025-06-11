import { writable } from 'svelte/store';

export function useContentObserver() {
  const hasContent = writable(false);

  const contentObserver = (textArea: HTMLTextAreaElement) => {
    const handler = () => {
      requestAnimationFrame(() => {
        hasContent.set(textArea.value.trim().length > 0);
      });
    };

    textArea.addEventListener('input', handler);

    return {
      destroy() {
        textArea.removeEventListener('input', handler);
      },
    };
  };

  return {
    contentObserver,
    hasContent,
  };
}
