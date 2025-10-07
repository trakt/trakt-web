import { BehaviorSubject, Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

/*
  Safari on iOS can sometimes be slow to update the layout when a dialog is opened.
  So, checking the dialog[open] attribute does not consistently work.
  Instead, we can use a MutationObserver to watch for changes to the open attribute.
*/
export function useDialogState() {
  const isOpen = new BehaviorSubject(false);

  const setDialogState = (dialog: HTMLDialogElement) => {
    const dialogState$ = new Observable<boolean>((subscriber) => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'open') {
            subscriber.next(dialog.open);
          }
        });
      });

      observer.observe(dialog, { attributes: true, attributeFilter: ['open'] });

      return () => observer.disconnect();
    }).pipe(startWith(dialog.open));

    const subscription = dialogState$.subscribe((open) => {
      globalThis.document.body.classList.toggle('dialog-open', open);
      isOpen.next(open);
    });

    return {
      destroy() {
        subscription.unsubscribe();
      },
    };
  };

  return {
    isOpen: isOpen.asObservable(),
    setDialogState,
  };
}
