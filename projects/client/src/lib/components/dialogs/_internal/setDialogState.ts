import { onMount } from 'svelte';

/*
  Safari on iOS can sometimes be slow to update the layout when a dialog is opened.
  So, checking the dialog[open] attribute does not consistently work.
  Instead, we can use a MutationObserver to watch for changes to the open attribute.
*/
export function setDialogState(dialog: HTMLDialogElement) {
  const setState = () =>
    globalThis.document.body.classList.toggle('dialog-open', dialog.open);

  // A mutation observer is used since a dialog has no open/show event
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName !== 'open') {
        return;
      }

      setState();
    });
  });

  observer.observe(dialog, { attributes: true });

  onMount(setState);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
