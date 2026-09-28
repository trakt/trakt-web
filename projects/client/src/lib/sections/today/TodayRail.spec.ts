import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import TodayRail from './TodayRail.svelte';

describe('TodayRail', () => {
  it('should show a story for each title friends were active on', async () => {
    renderComponent(TodayRail, { props: { type: 'media' } });

    expect(
      await screen.findByRole('link', {
        name: `Open the story for ${MovieHereticMappedMock.title}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: `Open the story for ${ShowSiloMappedMock.title}`,
      }),
    ).toBeInTheDocument();
  });

  it('should only show shows in show mode', async () => {
    renderComponent(TodayRail, { props: { type: 'show' } });

    expect(
      await screen.findByRole('link', {
        name: `Open the story for ${ShowSiloMappedMock.title}`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', {
        name: `Open the story for ${MovieHereticMappedMock.title}`,
      }),
    ).not.toBeInTheDocument();
  });
});
