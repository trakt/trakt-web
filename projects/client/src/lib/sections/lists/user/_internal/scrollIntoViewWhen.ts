import { nearestScrollTop } from './nearestScrollTop.ts';

const scrollContainerClassName = 'trakt-drawer-content';

function layoutTop(element: HTMLElement) {
  let top = 0;
  let current: HTMLElement | null = element;

  while (current != null) {
    top += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }

  return top;
}

function toPixels(value: string) {
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

export function scrollIntoViewWhen(node: HTMLElement, active: boolean) {
  const scroll = (shouldScroll: boolean) => {
    if (!shouldScroll) {
      return;
    }

    const container = node.closest<HTMLElement>(
      `.${scrollContainerClassName}`,
    );

    if (container == null) {
      return;
    }

    const style = globalThis.getComputedStyle(node);

    const target = nearestScrollTop({
      elementTop: layoutTop(node) - layoutTop(container),
      elementHeight: node.offsetHeight,
      marginStart: toPixels(style.scrollMarginBlockStart),
      marginEnd: toPixels(style.scrollMarginBlockEnd),
      scrollTop: container.scrollTop,
      viewportHeight: container.clientHeight,
    });

    if (target == null) {
      return;
    }

    container.scrollTo({ top: target, behavior: 'smooth' });
  };

  scroll(active);

  return {
    update: scroll,
  };
}
