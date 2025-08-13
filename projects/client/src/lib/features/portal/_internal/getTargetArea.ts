export function getTargetArea() {
  const openDialog = document.querySelector('dialog[open]');

  if (openDialog) {
    const dialogRect = openDialog.getBoundingClientRect();

    return {
      viewport: {
        left: dialogRect.left,
        top: dialogRect.top,
        width: dialogRect.width,
        height: dialogRect.height,
      },
      target: openDialog,
    };
  }

  return {
    viewport: {
      left: globalThis.window.scrollX,
      top: globalThis.window.scrollY,
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    },
    target: document.body,
  };
}
