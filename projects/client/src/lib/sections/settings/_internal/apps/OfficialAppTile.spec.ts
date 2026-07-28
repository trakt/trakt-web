import type { OfficialApp } from './OfficialApp.ts';
import OfficialAppTile from './OfficialAppTile.svelte';

import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

const destination = {
  store: 'google-play',
  href: 'https://play.google.com/store/apps/details?id=tv.trakt.trakt',
} as const;

const androidApp: OfficialApp = {
  name: 'Trakt',
  iconUrl: '/images/apps/official/trakt-android.webp',
  destinations: [destination],
};

describe('OfficialAppTile', () => {
  it('should render an official app as a store link', () => {
    const { container } = render(OfficialAppTile, {
      props: { app: androidApp, destination },
    });

    const storeLink = screen.getByRole('link', { name: androidApp.name });

    expect(storeLink).toHaveAttribute('href', destination.href);
    expect(storeLink).toHaveAttribute('target', '_blank');
    expect(screen.getByText(androidApp.name)).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      androidApp.iconUrl,
    );
  });
});
