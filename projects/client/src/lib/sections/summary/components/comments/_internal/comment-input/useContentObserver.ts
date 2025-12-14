import { BehaviorSubject } from 'rxjs';

export function useContentObserver() {
  const hasContent = new BehaviorSubject(false);

  const contentObserver = (textArea: HTMLTextAreaElement) => {
    const handler = () => {
      requestAnimationFrame(() => {
        hasContent.next(textArea.value.trim().length > 0);
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
