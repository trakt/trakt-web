import { useVarToPixels } from '../../stores/css/useVarToPixels.ts';
import { GlobalEventBus } from '../events/GlobalEventBus.ts';

const SCROLL_THRESHOLD = 10;

export function trackWindowScrollDirection(
  node: HTMLElement,
  props: {
    upClassName: string;
    downClassName: string;
    offsetVar: string;
  },
) {
  let lastScrollY = 0;

  const offset = useVarToPixels(props.offsetVar);
  let offsetValue = 0;
  const subscription = offset.subscribe((value) => {
    offsetValue = value;
  });

  function reset() {
    lastScrollY = 0;
    node.classList.remove(props.upClassName, props.downClassName);
  }

  function handleScroll() {
    const currentScrollY = globalThis.window.scrollY;
    if (currentScrollY <= offsetValue) {
      reset();
      return;
    }

    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    if (scrollDelta < SCROLL_THRESHOLD) {
      return;
    }

    const isScrollingDown = currentScrollY > lastScrollY;
    const isScrollingUp = currentScrollY < lastScrollY;

    node.classList.toggle(props.upClassName, isScrollingUp);
    node.classList.toggle(props.downClassName, isScrollingDown);

    lastScrollY = currentScrollY;
  }

  lastScrollY = globalThis.window.scrollY;
  handleScroll();

  const unregister = GlobalEventBus.getInstance().register(
    'scroll',
    handleScroll,
  );

  return {
    destroy() {
      subscription.unsubscribe();
      unregister();
    },
  };
}
