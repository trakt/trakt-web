import * as m from '$lib/features/i18n/messages.ts';
import OfficialAppsGallery from './OfficialAppsGallery.svelte';
import { officialAppCatalog } from './officialAppCatalog.ts';

import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

describe('OfficialAppsGallery', () => {
  it('should filter the app tiles by platform', async () => {
    const { container } = render(OfficialAppsGallery);

    expect(screen.getByText('Trakt')).toBeInTheDocument();
    expect(screen.getByText('Showly')).toBeInTheDocument();
    expect(screen.getByText('Watcht')).toBeInTheDocument();
    expect(screen.getByText('Rippple')).toBeInTheDocument();
    expect(screen.queryByText('Trakt Time')).not.toBeInTheDocument();
    expect(container.querySelectorAll('img')).toHaveLength(4);

    await fireEvent.click(
      screen.getByRole('tab', {
        name: m.tab_text_official_apps_android(),
      }),
    );

    expect(screen.getByText('Trakt')).toBeInTheDocument();
    expect(screen.getByText('Showly')).toBeInTheDocument();
    expect(screen.queryByText('Watcht')).not.toBeInTheDocument();
    expect(screen.queryByText('Trakt Time')).not.toBeInTheDocument();

    await fireEvent.click(
      screen.getByRole('tab', {
        name: m.tab_text_official_apps_web(),
      }),
    );

    expect(screen.getByText('Trakt Time')).toBeInTheDocument();
    expect(screen.queryByText('Showly')).not.toBeInTheDocument();
  });

  it('should link Showly to the store for the active platform', async () => {
    render(OfficialAppsGallery);

    const showly = officialAppCatalog.find((app) => app.name === 'Showly');
    const appStore = showly?.destinations.find(
      ({ store }) => store === 'app-store',
    );
    const googlePlay = showly?.destinations.find(
      ({ store }) => store === 'google-play',
    );

    expect(screen.getByRole('link', { name: 'Showly' }))
      .toHaveAttribute('href', appStore?.href);

    await fireEvent.click(
      screen.getByRole('tab', {
        name: m.tab_text_official_apps_android(),
      }),
    );

    expect(screen.getByRole('link', { name: 'Showly' }))
      .toHaveAttribute('href', googlePlay?.href);
  });
});
