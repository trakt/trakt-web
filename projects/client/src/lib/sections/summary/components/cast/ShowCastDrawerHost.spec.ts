import { ShowSiloPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloPeopleMappedMock.ts';
import { ShowSiloSplitPeopleMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSplitPeopleMappedMock.ts';
import { ShowSiloResponseMock } from '$mocks/data/summary/shows/silo/response/ShowSiloResponseMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ShowCastDrawerHost from './ShowCastDrawerHost.svelte';

// The drawer has to open and the split-credits request has to resolve before
// the grouped list renders; the first test in the file also pays cold-start
// cost, which can exceed the default 1s wait on a busy machine.
const SPLIT_CREDITS_TIMEOUT = 5_000;

describe('ShowCastDrawerHost', () => {
  it('should load split credits when opened with the full show-page cast', async () => {
    Element.prototype.scrollTo = vi.fn();
    const user = userEvent.setup();
    renderComponent(ShowCastDrawerHost, {
      props: {
        slug: ShowSiloResponseMock.ids.slug,
        crew: ShowSiloPeopleMappedMock,
        onClose: vi.fn(),
      },
    });

    expect(
      within(
        await screen.findByRole(
          'list',
          { name: /^Main Cast/ },
          { timeout: SPLIT_CREDITS_TIMEOUT },
        ),
      ).queryByText('Sophie Thompson'),
    ).not.toBeInTheDocument();

    await user.click(
      await screen.findByRole('radio', { name: 'Supporting Cast' }),
    );

    const guests = await screen.findByRole('list', {
      name: 'Supporting Cast 1 person',
    });
    expect(within(guests).getByText('Sophie Thompson')).toBeInTheDocument();
  });

  it('should not show the full show-page cast count while split credits load', async () => {
    Element.prototype.scrollTo = vi.fn();
    renderComponent(ShowCastDrawerHost, {
      props: {
        slug: ShowSiloResponseMock.ids.slug,
        crew: ShowSiloPeopleMappedMock,
        onClose: vi.fn(),
      },
    });

    expect(
      await screen.findByRole(
        'heading',
        { name: /^Main Cast/ },
        { timeout: SPLIT_CREDITS_TIMEOUT },
      ),
    )
      .toHaveAccessibleName(
        `Main Cast ${ShowSiloSplitPeopleMappedMock.cast.length} people`,
      );
  });
});
