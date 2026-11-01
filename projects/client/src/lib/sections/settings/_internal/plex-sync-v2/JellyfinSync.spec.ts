import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import JellyfinSync from './JellyfinSync.svelte';

vi.mock('$lib/features/auth/stores/useUser.ts', () => ({
  useUser: () => ({
    user: of({ isVip: false }),
    limits: of(null),
  }),
}));

const { connections } = vi.hoisted(() => ({
  connections: { current: [] as unknown[] },
}));

vi.mock('$lib/features/query/useQuery.ts', () => ({
  useQuery: () => of({ data: connections.current, isError: false }),
}));

vi.mock('./SyncedServers.svelte', () => ({ default: () => {} }));

vi.mock('./useJellyfinConnect.ts', () => ({
  useJellyfinConnect: () => ({
    state: of({ step: 'sign-in' }),
    start: vi.fn(),
    cancel: vi.fn(),
  }),
}));

describe('JellyfinSync', () => {
  beforeEach(() => {
    connections.current = [];
  });

  it('gives a free account the connect button instead of an upsell', async () => {
    renderComponent(JellyfinSync, { props: {} });

    expect(
      await screen.findByRole('button', {
        name: 'Connect your Jellyfin server',
      }),
    ).toBeTruthy();
    expect(screen.queryByText(/VIP/)).toBeNull();
    expect(screen.queryByText('Beta')).toBeNull();
  });

  it('shows a free account the VIP upsell when it adds a second server', async () => {
    connections.current = [
      { id: 1, provider: 'jellyfin', status: 'active', serverName: 'Home' },
    ];
    renderComponent(JellyfinSync, { props: {} });

    await userEvent
      .setup()
      .click(await screen.findByRole('button', { name: /add/i }));

    expect(
      await screen.findByText('Multiple servers is a VIP feature'),
    ).toBeTruthy();
  });
});
