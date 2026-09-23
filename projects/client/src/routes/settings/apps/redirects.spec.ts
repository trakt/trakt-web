import { isRedirect } from '@sveltejs/kit';
import { describe, expect, it, vi } from 'vitest';
import { load as loadApps } from './+page.ts';
import { load as loadApiApps } from './api/+page.ts';
import { load as loadApiApp } from './api/[id]/+page.ts';
import { load as loadApiAppEditor } from './api/[id]/edit/+page.ts';
import { load as loadNewApiApp } from './api/new/+page.ts';

// Route imports are instrumented by Vite; keep telemetry outside these tests.
vi.mock('@sentry/sveltekit', () => ({
  wrapLoadWithSentry: <T>(load: T) => load,
}));

const captureRedirect = (load: () => never) => {
  try {
    load();
  } catch (error) {
    if (!isRedirect(error)) {
      throw error;
    }

    return { status: error.status, location: error.location };
  }
};

describe('routes: retired app settings', () => {
  it.each([
    { load: loadApps, location: '/settings/apps/connected' },
    { load: loadApiApps, location: 'https://developer.trakt.tv/apps' },
    { load: loadNewApiApp, location: 'https://developer.trakt.tv/apps/new' },
  ])('should permanently redirect to $location', ({ load, location }) => {
    expect(captureRedirect(load)).toEqual({ status: 301, location });
  });

  it.each(['901', '902'])('should preserve app %s in detail links', (id) => {
    expect(captureRedirect(() => loadApiApp({ params: { id } }))).toEqual({
      status: 301,
      location: `https://developer.trakt.tv/apps/${id}`,
    });
  });

  it.each(['901', '902'])('should preserve app %s in edit links', (id) => {
    expect(captureRedirect(() => loadApiAppEditor({ params: { id } }))).toEqual(
      {
        status: 301,
        location: `https://developer.trakt.tv/apps/${id}/edit`,
      },
    );
  });
});
