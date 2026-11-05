import { lineClamp } from '$lib/components/text/lineClamp.ts';

type Clamp = ReturnType<typeof lineClamp>;

const END_RESERVE = 'var(--clamp-items-end-reserve, 0px)';

export function clampItemsToFit(node: HTMLElement, _trigger?: unknown) {
  const state: { clamp: Clamp | null } = { clamp: null };

  const fits = (item: Element) =>
    item.getBoundingClientRect().bottom <=
    node.getBoundingClientRect().bottom + 0.5;

  const findFittingLines = (item: HTMLElement, clamp: Clamp, lines: number) => {
    clamp.update({ lines });
    if (!fits(item)) return lines - 1;

    return findFittingLines(item, clamp, lines + 1);
  };

  const show = (item: HTMLElement) => {
    item.style.removeProperty('display');
    item.style.removeProperty('margin-inline-end');
  };

  const hide = (item: HTMLElement) => {
    item.style.setProperty('display', 'none');
    item.style.removeProperty('margin-inline-end');
  };

  const reset = (items: ReadonlyArray<HTMLElement>) => {
    state.clamp?.destroy();
    state.clamp = null;
    items.forEach(show);
  };

  const clampToFit = (item: HTMLElement) => {
    const text = item.firstElementChild;
    if (!(text instanceof HTMLElement)) return false;

    const clamp = lineClamp(text, { lines: 1 });
    const lines = findFittingLines(item, clamp, 1);

    if (lines === 0) {
      clamp.destroy();
      return false;
    }

    clamp.update({ lines });
    state.clamp = clamp;
    return true;
  };

  const settleLastVisible = (
    items: ReadonlyArray<HTMLElement>,
    index: number,
  ) => {
    if (index < 0) return;

    const item = items.at(index);
    if (!item) return;

    items.slice(index + 1).forEach(hide);
    item.style.setProperty('margin-inline-end', END_RESERVE);

    if (fits(item) || clampToFit(item)) return;

    hide(item);
    settleLastVisible(items, index - 1);
  };

  const update = () => {
    const items = Array.from(node.children) as HTMLElement[];
    reset(items);

    const overflowIndex = items.findIndex((item) => !fits(item));
    settleLastVisible(
      items,
      overflowIndex === -1 ? items.length - 1 : overflowIndex,
    );
  };

  update();

  const resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(node);

  return {
    update,
    destroy() {
      resizeObserver.disconnect();
      reset(Array.from(node.children) as HTMLElement[]);
    },
  };
}
