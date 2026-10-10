import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import SoundtrackDrawerHost from './SoundtrackDrawerHost.svelte';

const SOUNDTRACK_TIMEOUT = 5_000;

function renderDrawer(currentSeason?: number) {
  renderComponent(SoundtrackDrawerHost, {
    props: { media: ShowSiloMappedMock, currentSeason, onClose: vi.fn() },
  });
}

async function rowTexts() {
  const title = await screen.findByText('Silo Main Title', {}, {
    timeout: SOUNDTRACK_TIMEOUT,
  });
  const list = title.closest('ul');
  if (!list) throw new Error('the song rows render outside a list');
  return within(list).getAllByRole('listitem').map((row) =>
    row.textContent?.replace(/\s+/g, ' ').trim()
  );
}

describe('SoundtrackDrawerHost', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should list the whole show by default', async () => {
    renderDrawer(2);

    expect(await rowTexts()).toHaveLength(3);
  });

  it('should limit the list to the season and series-wide songs', async () => {
    const user = userEvent.setup();
    renderDrawer(2);
    await rowTexts();

    await user.click(screen.getByRole('switch', { name: 'Season 2 only' }));

    const rows = await rowTexts();
    expect(rows).toHaveLength(2);
    expect(rows[0]).toContain('1 Silo Main Title');
    expect(rows[1]).toContain('2 Lukas');
  });

  it('should hide the switch when no song belongs to the season', async () => {
    renderDrawer(5);
    await rowTexts();

    expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  });
});
