type ScrollToHashOnceParams = {
  ready: boolean;
};

export function scrollToHashOnce(
  node: HTMLElement,
  { ready }: ScrollToHashOnceParams,
) {
  let isDone = false;
  let frameId: number | null = null;

  const scroll = (isReady: boolean) => {
    if (isDone || !isReady || globalThis.location.hash !== `#${node.id}`) {
      return;
    }

    isDone = true;
    frameId = requestAnimationFrame(() =>
      node.scrollIntoView({ block: 'start' })
    );
  };

  scroll(ready);

  return {
    update: (next: ScrollToHashOnceParams) => scroll(next.ready),
    destroy: () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
    },
  };
}
