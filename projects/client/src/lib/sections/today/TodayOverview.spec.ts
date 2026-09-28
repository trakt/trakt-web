import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import TodayOverview from './TodayOverview.svelte';

describe('TodayOverview', () => {
  it('should group friend activity by title', async () => {
    renderComponent(TodayOverview, { props: { type: 'media' } });

    expect(await screen.findByText('From people you follow'))
      .toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: MovieHereticMappedMock.title }),
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
});
