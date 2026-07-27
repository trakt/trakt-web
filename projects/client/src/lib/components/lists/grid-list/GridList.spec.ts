import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import GridList from './GridList.svelte';

type TestItem = { key: string; title: string };

function renderGridList(items: TestItem[]) {
  return render(GridList<TestItem>, {
    props: {
      id: 'test-grid-list',
      title: undefined,
      items,
      groupBy: (item: TestItem) => item.title[0] ?? '#',
      item: createRawSnippet((item: () => TestItem) => ({
        render: () => `<div class="test-item">${item().title}</div>`,
      })),
    },
  });
}

function toRenderedSequence(container: HTMLElement) {
  const nodes = container.querySelectorAll(
    '.trakt-letter-group-header, .test-item',
  );

  return Array.from(nodes, (node) => node.textContent?.trim());
}

describe('GridList', () => {
  it('should keep items in the order they were given', () => {
    const { container } = renderGridList([
      { key: '1', title: 'Alpha' },
      { key: '2', title: 'Beta' },
      { key: '3', title: 'Andromeda' },
    ]);

    expect(toRenderedSequence(container)).to.deep.equal([
      'A',
      'Alpha',
      'B',
      'Beta',
      'A',
      'Andromeda',
    ]);
  });

  it('should collect consecutive items sharing a group key', () => {
    const { container } = renderGridList([
      { key: '1', title: 'Alpha' },
      { key: '2', title: 'Andromeda' },
      { key: '3', title: 'Beta' },
    ]);

    expect(toRenderedSequence(container)).to.deep.equal([
      'A',
      'Alpha',
      'Andromeda',
      'B',
      'Beta',
    ]);
  });
});
