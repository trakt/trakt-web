import { PlexServersMappedMock } from '$mocks/data/plex/mapped/PlexServersMappedMock.ts';
import { PlexSettingsResponseMock } from '$mocks/data/plex/response/PlexSettingsResponseMock.ts';
import { server } from '$mocks/server.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { fireEvent, screen } from '@testing-library/svelte';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlexSyncedServers from './PlexSyncedServers.svelte';
import type { PlexSyncedServersProps } from './PlexSyncedServersProps.ts';

const SYNCED_SERVER_ID = PlexSettingsResponseMock.sync.selection.server_ids[0];
const SYNCED_SERVER_NAME = PlexServersMappedMock[0].name;
const EMPTY_STATE = 'No synced servers yet';
const ERROR_MESSAGE = 'Plex is currently unavailable.';

function serveEmptySelection() {
  server.use(
    http.get('http://localhost/users/settings/plex', () => {
      return HttpResponse.json({
        ...PlexSettingsResponseMock,
        sync: {
          ...PlexSettingsResponseMock.sync,
          selection: { server_ids: [], library_ids: [], user_ids: [] },
        },
      });
    }),
  );
}

function renderServers(props: Partial<PlexSyncedServersProps> = {}) {
  const onRetryServers = vi.fn();

  const { container } = renderComponent(PlexSyncedServers, {
    props: {
      servers: [],
      serversState: 'loaded',
      isSyncing: false,
      onSyncNow: vi.fn(),
      onRetryServers,
      ...props,
    },
  });

  return { container, onRetryServers };
}

describe('PlexSyncedServers', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should render the error state when the server list fails to load', async () => {
    renderServers({ serversState: 'error' });

    expect(await screen.findByText(ERROR_MESSAGE)).toBeInTheDocument();
  });

  it('should retry the server list from the error state', async () => {
    const { onRetryServers } = renderServers({ serversState: 'error' });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Retry' }),
    );

    expect(onRetryServers).toHaveBeenCalled();
  });

  it('should not render the empty state while the server list is loading', async () => {
    serveEmptySelection();
    const { container } = renderServers({ serversState: 'loading' });

    await screen.findByText('Synced Servers');

    expect(container.querySelector('.trakt-skeleton')).toBeNull();
    expect(screen.queryByText(EMPTY_STATE)).not.toBeInTheDocument();
  });

  it('should render the empty state once the server list is loaded and empty', async () => {
    serveEmptySelection();
    renderServers();

    expect(await screen.findByText(EMPTY_STATE)).toBeInTheDocument();
  });

  it('should name a synced server from the loaded server list', async () => {
    renderServers({ servers: PlexServersMappedMock });

    expect(await screen.findByText(SYNCED_SERVER_NAME)).toBeInTheDocument();
  });

  it('should skeleton a synced server name when the server list is unavailable', async () => {
    const { container } = renderServers({ serversState: 'error' });

    await screen.findByText(ERROR_MESSAGE);
    await screen.findByRole('button', { name: 'Manage server libraries' });

    expect(screen.queryByText(SYNCED_SERVER_ID)).not.toBeInTheDocument();
    expect(container.querySelector('.trakt-skeleton')).not.toBeNull();
  });
});
