import { ShowSiloMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloMappedMock.ts';
import { ShowSiloSeasonsMappedMock } from '$mocks/data/summary/shows/silo/mapped/ShowSiloSeasonsMappedMock.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { setAuthorization } from '$test/beds/store/renderStore.ts';
import { screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import SeasonItem from './SeasonItem.svelte';

const [season] = ShowSiloSeasonsMappedMock;

describe('component: SeasonItem', () => {
  beforeEach(() => {
    setAuthorization(true);
  });

  it('should show the season label and cover for the default variant', async () => {
    renderComponent(SeasonItem, {
      props: {
        season,
        media: ShowSiloMappedMock,
        urlBuilder: () => '/shows/silo/seasons/1',
      },
    });

    expect(await screen.findByText('Season 1')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Season 1' })).toBeInTheDocument();
  });

  it('should show the season title as subtitle when present', async () => {
    renderComponent(SeasonItem, {
      props: {
        season: { ...season, title: 'The Descent' },
        media: ShowSiloMappedMock,
        urlBuilder: () => '/shows/silo/seasons/1',
      },
    });

    expect(await screen.findByText('The Descent')).toBeInTheDocument();
  });

  it('should render the popup menu when popup actions are provided', async () => {
    renderComponent(SeasonItem, {
      props: {
        season,
        media: ShowSiloMappedMock,
        urlBuilder: () => '/shows/silo/seasons/1',
        popupActions: createRawSnippet(() => ({
          render: () => '<span>Season action</span>',
        })),
      },
    });

    expect(
      await screen.findByRole('button', { name: 'Pop up menu for "Season 1"' }),
    ).toBeInTheDocument();
  });

  it('should not render the popup menu without popup actions', async () => {
    renderComponent(SeasonItem, {
      props: {
        season,
        media: ShowSiloMappedMock,
        urlBuilder: () => '/shows/silo/seasons/1',
      },
    });

    await screen.findByText('Season 1');
    expect(
      screen.queryByRole('button', { name: 'Pop up menu for "Season 1"' }),
    ).toBeNull();
  });
});
