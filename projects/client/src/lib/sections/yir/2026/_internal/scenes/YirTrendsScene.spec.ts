import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import YirTrendsScene from './YirTrendsScene.svelte';

describe('YirTrendsScene', () => {
  it('should render every month when the same title trends twice', () => {
    const items = [1, 2].map((month) => ({
      month,
      watchers: 10,
      watched: false,
      entry: ShowSiloMappedMock,
    }));

    const { container } = render(YirTrendsScene, {
      props: { id: 'trends', index: 0, type: 'shows', items, year: 2026 },
    });

    expect(container.querySelectorAll('.yir-trends li')).toHaveLength(2);
  });
});
