import { PlexServersMappedMock } from '$mocks/data/plex/mapped/PlexServersMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { fireEvent, screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PlexSyncedServers from './PlexSyncedServers.svelte';
import type { PlexSyncedServersProps } from './PlexSyncedServersProps.ts';

const SECTION_TITLE = 'Synced Servers';
const EMPTY_STATE = 'No synced servers yet';
const ERROR_MESSAGE = 'Plex is currently unavailable.';

function renderServers(props: Partial<PlexSyncedServersProps> = {}) {
  const onRetryServers = vi.fn();

  renderComponent(PlexSyncedServers, {
    props: {
      servers: [],
      serversState: 'loaded',
      isSyncing: false,
      onSyncNow: vi.fn(),
      onRetryServers,
      ...props,
    },
  });

  return onRetryServers;
}

describe('PlexSyncedServers', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should render the error state when the server list fails to load', async () => {
    renderServers({ serversState: 'error' });

    expect(await screen.findByText(ERROR_MESSAGE)).toBeInTheDocument();
    expect(screen.queryByText(EMPTY_STATE)).not.toBeInTheDocument();
  });

  it('should retry the server list from the error state', async () => {
    const onRetryServers = renderServers({ serversState: 'error' });

    await fireEvent.click(
      await screen.findByRole('button', { name: 'Retry' }),
    );

    expect(onRetryServers).toHaveBeenCalled();
  });

  it('should not render the empty state while the server list is loading', async () => {
    renderServers({ serversState: 'loading' });

    await screen.findByText(SECTION_TITLE);

    expect(screen.queryByText(EMPTY_STATE)).not.toBeInTheDocument();
    expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
  });

  it('should render the empty state when the server list is loaded and empty', async () => {
    renderServers();

    expect(await screen.findByText(EMPTY_STATE)).toBeInTheDocument();
  });

  it('should render the empty state when a loaded server has not been added yet', async () => {
    renderServers({ servers: PlexServersMappedMock });

    expect(await screen.findByText(EMPTY_STATE)).toBeInTheDocument();
  });
});
