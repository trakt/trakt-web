import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { createRawSnippet } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import WebhookCard from './WebhookCard.svelte';

const { track, useTrack, copyToClipboard } = vi.hoisted(() => {
  const track = vi.fn();
  return {
    track,
    useTrack: vi.fn(() => ({ track })),
    copyToClipboard: vi.fn(),
  };
});

vi.mock('$lib/features/analytics/useTrack.ts', () => ({ useTrack }));
vi.mock('$lib/utils/clipboard/copyToClipboard.ts', () => ({ copyToClipboard }));

function renderCard(provider: 'plex' | 'jellyfin') {
  return renderComponent(WebhookCard, {
    props: {
      provider,
      title: provider,
      description: 'description',
      webhook: { url: 'https://example.test/hook', serverNames: ['Home'] },
      logo: createRawSnippet(() => ({ render: () => '<span></span>' })),
    },
  });
}

describe('WebhookCard', () => {
  beforeEach(() => {
    track.mockClear();
    copyToClipboard.mockReset();
  });

  it.each(['plex', 'jellyfin'] as const)(
    'should track a %s webhook copy',
    async (provider) => {
      copyToClipboard.mockResolvedValue(undefined);
      renderCard(provider);

      await userEvent.setup().click(await screen.findByRole('button'));

      expect(useTrack).toHaveBeenCalledWith(AnalyticsEvent.CopyWebhook);
      expect(track).toHaveBeenCalledExactlyOnceWith({ provider });
    },
  );

  it('should not track when the copy fails', async () => {
    copyToClipboard.mockRejectedValue(new Error('denied'));
    renderCard('plex');

    await userEvent.setup().click(await screen.findByRole('button'));

    await vi.waitFor(() => expect(copyToClipboard).toHaveBeenCalled());
    await Promise.resolve();
    expect(track).not.toHaveBeenCalled();
  });
});
