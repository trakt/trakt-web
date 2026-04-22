export function preventUnload(_node: HTMLElement, isActive: boolean) {
  function handler(e: BeforeUnloadEvent) {
    if (!isActive) return;
    e.preventDefault();
    e.returnValue = '';
  }

  globalThis.window.addEventListener('beforeunload', handler);

  return {
    update(next: boolean) {
      isActive = next;
    },
    destroy() {
      globalThis.window.removeEventListener('beforeunload', handler);
    },
  };
}
