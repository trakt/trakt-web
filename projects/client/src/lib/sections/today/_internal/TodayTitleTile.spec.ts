import { assertDefined } from '$lib/utils/assert/assertDefined.ts';
import { MovieHereticMappedMock } from '$mocks/data/summary/movies/heretic/mapped/MovieHereticMappedMock.ts';
import { buildFollowingActivity } from '$test/beds/today/buildFollowingActivity.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TodayTitleTile from './TodayTitleTile.svelte';
import { toTitleStories } from './toTitleStories.ts';

function renderTile(id: number) {
  const movie = { ...MovieHereticMappedMock, id };
  const story = assertDefined(
    toTitleStories([
      buildFollowingActivity({ target: { type: 'movie', movie } }),
    ]).at(0),
  );

  renderComponent(TodayTitleTile, { props: { story, onOpen: vi.fn() } });
}

describe('TodayTitleTile', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should say when the user watched the title too', async () => {
    renderTile(916302);

    expect(
      await screen.findByRole('button', {
        name: `${MovieHereticMappedMock.title}, You watched this too`,
      }),
    ).toBeInTheDocument();
  });

  it('should only use the title when the user has not watched it', async () => {
    renderTile(1);

    expect(
      await screen.findByRole('button', { name: MovieHereticMappedMock.title }),
    ).toBeInTheDocument();
  });
});
