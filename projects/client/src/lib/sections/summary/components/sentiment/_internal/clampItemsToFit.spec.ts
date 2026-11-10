import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clampItemsToFit } from './clampItemsToFit.ts';

const LINE_HEIGHT = 20;
const CONTAINER_BOTTOM = 100;

type ItemSpec = { lines: number; hasText?: boolean };

function setup(specs: ItemSpec[]) {
  const node = document.createElement('div');
  const items = specs.map(({ lines, hasText = true }) => {
    const item = document.createElement('div');
    if (hasText) item.append(document.createElement('span'));
    node.append(item);
    return { item, lines };
  });
  document.body.append(node);

  const clampedLines = (item: HTMLElement) => {
    const value = item.firstElementChild?.getAttribute('style') ?? '';
    return Number(/-webkit-line-clamp:\s*(\d+)/.exec(value)?.at(1));
  };

  const heightOf = ({ item, lines }: (typeof items)[number]) => {
    if (item.style.display === 'none') return 0;
    const clamp = clampedLines(item);
    return Math.min(lines, Number.isNaN(clamp) ? lines : clamp) * LINE_HEIGHT;
  };

  const rect = (bottom: number) => ({ bottom }) as DOMRect;

  node.getBoundingClientRect = () => rect(CONTAINER_BOTTOM);
  items.forEach((entry, index) => {
    entry.item.getBoundingClientRect = () =>
      rect(
        items
          .slice(0, index + 1)
          .reduce((total, current) => total + heightOf(current), 0),
      );
  });

  return { node, elements: items.map(({ item }) => item) };
}

describe('util: clampItemsToFit', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should leave every item visible when they all fit', () => {
    const { node, elements } = setup([{ lines: 2 }, { lines: 2 }]);

    clampItemsToFit(node);

    expect(elements.map((item) => item.style.display)).toEqual(['', '']);
  });

  it('should clamp the overflowing item to the lines that fit', () => {
    const { node, elements } = setup([
      { lines: 2 },
      { lines: 2 },
      { lines: 2 },
    ]);

    clampItemsToFit(node);

    expect(elements.map((item) => item.style.display)).toEqual(['', '', '']);
    expect(elements.at(2)?.firstElementChild?.getAttribute('style')).toContain(
      '-webkit-line-clamp: 1',
    );
  });

  it('should hide every item after the one that overflows', () => {
    const { node, elements } = setup([
      { lines: 3 },
      { lines: 3 },
      { lines: 3 },
      { lines: 3 },
    ]);

    clampItemsToFit(node);

    expect(elements.map((item) => item.style.display)).toEqual([
      '',
      '',
      'none',
      'none',
    ]);
  });

  it('should hide an item that cannot fit even on one line', () => {
    const { node, elements } = setup([{ lines: 5 }, { lines: 2 }]);

    clampItemsToFit(node);

    expect(elements.at(1)?.style.display).toBe('none');
    expect(elements.at(0)?.style.display).toBe('');
  });

  it('should hide an overflowing item that has no text to clamp', () => {
    const { node, elements } = setup([
      { lines: 4 },
      { lines: 4, hasText: false },
    ]);

    clampItemsToFit(node);

    expect(elements.at(1)?.style.display).toBe('none');
  });

  it('should show everything again once the content fits', () => {
    const { node, elements } = setup([
      { lines: 3 },
      { lines: 3 },
      { lines: 3 },
    ]);
    const action = clampItemsToFit(node);
    expect(elements.at(2)?.style.display).toBe('none');

    elements.forEach((item) => item.querySelector('span')?.remove());
    elements.forEach((item) => item.append(document.createElement('span')));
    node.getBoundingClientRect = () => ({ bottom: 1000 }) as DOMRect;
    action.update();

    expect(elements.map((item) => item.style.display)).toEqual(['', '', '']);
  });

  it('should restore the items when destroyed', () => {
    const { node, elements } = setup([
      { lines: 3 },
      { lines: 3 },
      { lines: 3 },
    ]);
    const action = clampItemsToFit(node);

    action.destroy();

    expect(elements.map((item) => item.style.display)).toEqual(['', '', '']);
    expect(elements.at(-1)?.style.marginInlineEnd).toBe('');
  });
});
