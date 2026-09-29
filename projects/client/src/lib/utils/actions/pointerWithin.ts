import { GlobalEventBus } from '$lib/utils/events/GlobalEventBus.ts';
import { isPointWithinRect } from './_internal/isPointWithinRect.ts';

type PointerWithinProps = {
  onChange: (isWithin: boolean) => void;
  exitMargin?: number;
};

export function pointerWithin(node: HTMLElement, props: PointerWithinProps) {
  const bus = GlobalEventBus.getInstance();
  let current = props;
  let isWithin = false;

  const setWithin = (next: boolean) => {
    if (next === isWithin) return;

    isWithin = next;
    current.onChange(next);
  };

  const unregisterMove = bus.register('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;

    setWithin(
      isPointWithinRect({
        rect: node.getBoundingClientRect(),
        x: event.clientX,
        y: event.clientY,
        margin: isWithin ? current.exitMargin : 0,
      }),
    );
  });

  const unregisterOut = bus.register('pointerout', (event) => {
    if (event.relatedTarget === null) setWithin(false);
  });

  return {
    update(next: PointerWithinProps) {
      current = next;
    },
    destroy() {
      unregisterMove();
      unregisterOut();
    },
  };
}
