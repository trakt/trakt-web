import PageView from './PageView.svelte';

import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const trackSpy = vi.fn();
let routeId: string | null = null;

vi.mock('$app/state', () => ({
  page: {
    get route() {
      return { id: routeId };
    },
  },
}));

vi.mock('./useTrack.ts', () => ({
  useTrack: () => ({ track: trackSpy }),
}));

describe('PageView', () => {
  beforeEach(() => {
    trackSpy.mockClear();
  });

  it('should track the route template', async () => {
    routeId = '/movies/[slug]';
    renderComponent(PageView, { props: {} });

    await waitFor(() =>
      expect(trackSpy).toHaveBeenCalledWith({ route: '/movies/[slug]' })
    );
  });

  it('should skip the auth redirect and unmatched routes', async () => {
    for (const route of ['/callback', '/silent-redirect', null, '/home']) {
      routeId = route;
      renderComponent(PageView, { props: {} });
      await tick();
    }

    await waitFor(() => expect(trackSpy).toHaveBeenCalled());
    expect(trackSpy.mock.calls).toEqual([[{ route: '/home' }]]);
  });
});
