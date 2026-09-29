import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { screen, waitFor, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import TodayOverview from './TodayOverview.svelte';

describe('TodayOverview', () => {
  it('should group friend activity by title by default', async () => {
    renderComponent(TodayOverview, { props: { type: 'media' } });

    expect(await screen.findByText('From people you follow'))
      .toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: MovieHereticMappedMock.title }),
    ).toBeInTheDocument();
    expect(screen.getByText('Most active')).toBeInTheDocument();
  });

  it('should feature a milestone story as the hero', async () => {
    renderComponent(TodayOverview, { props: { type: 'media' } });

    expect(
      await screen.findByRole('link', {
        name: `Play the story for ${ShowSiloMappedMock.title}`,
      }),
    ).toBeInTheDocument();
  });

  it('should open a title to show who did what', async () => {
    const user = userEvent.setup();
    renderComponent(TodayOverview, { props: { type: 'media' } });

    const tile = await screen.findByRole('button', {
      name: MovieHereticMappedMock.title,
    });
    await user.click(tile);

    expect(
      await screen.findByRole('link', {
        name: `Play the story for ${MovieHereticMappedMock.title}`,
      }),
    ).toBeInTheDocument();
  });

  it('should open a person from most active without grouping by person', async () => {
    const user = userEvent.setup();
    renderComponent(TodayOverview, { props: { type: 'media' } });

    const mostActive = assertDefined(
      (await screen.findByText('Most active')).closest('section'),
    );
    const person = assertDefined(
      within(mostActive).getAllByRole('button').at(0),
    );
    await user.click(person);

    await waitFor(() => {
      expect(document.querySelector('.trakt-today-person-drawer'))
        .toBeInTheDocument();
    });
  });
});
