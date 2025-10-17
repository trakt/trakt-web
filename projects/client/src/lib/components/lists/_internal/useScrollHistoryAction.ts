import { writable } from 'svelte/store';
import { useScrollHistory } from './useScrollHistory.ts';

type DestroyCallback = () => void;

export function useScrollHistoryAction(
  type: 'horizontal' | 'vertical' = 'horizontal',
) {
  const { readScrollState, writeScrollState, event } = useScrollHistory();

  function scrollHistory(container: HTMLElement, id: string) {
    let destroyRestore: DestroyCallback | undefined;
    let destroySnapshot: DestroyCallback | undefined;

    const scrollPosition = writable(0);

    const handleRestore = (restoreId: string) =>
      scrollPosition.set(readScrollState(restoreId));

    const handleSnapshot = (snapshotId: string) => {
      const position = type === 'horizontal'
        ? container.scrollLeft
        : container.scrollTop;
      writeScrollState(snapshotId, position);
    };

    const updateScrollPosition = (position: number) => {
      const scrollProp = type === 'horizontal' ? 'scrollLeft' : 'scrollTop';
      container[scrollProp] = position;
    };

    const resetHandlers = (handleId: string) => {
      destroyRestore?.();
      destroySnapshot?.();

      destroyRestore = event.on('restore', () => handleRestore(handleId));
      destroySnapshot = event.on('snapshot', () => handleSnapshot(handleId));
    };

    resetHandlers(id);

    const ubSubscribeScrollPosition = scrollPosition.subscribe(
      updateScrollPosition,
    );

    return {
      update: (updatedId: string) => {
        resetHandlers(updatedId);
        container.scrollTo({
          left: 0,
          behavior: 'instant',
        });
      },
      destroy: () => {
        destroyRestore?.();
        destroySnapshot?.();

        ubSubscribeScrollPosition();
      },
    };
  }

  return { scrollHistory };
}
