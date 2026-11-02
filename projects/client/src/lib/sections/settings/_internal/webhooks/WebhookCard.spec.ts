import { AnalyticsEvent } from '$lib/features/analytics/events/AnalyticsEvent.ts';
import { renderComponent } from '$test/beds/component/renderComponent.ts';
import { screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { createRawSnippet } from 'svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MediaServerWebhook } from './MediaServerWebhook.ts';
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

function renderCard(
  provider: 'plex' | 'jellyfin',
  status: Partial<MediaServerWebhook> = {},
) {
  return renderComponent(WebhookCard, {
    props: {
      provider,
      title: provider,
      description: 'description',
      webhook: {
        url: 'https://example.test/hook',
        serverNames: ['Home'],
        seenAt: null,
        refusal: null,
        ...status,
      },
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

  it.each([
    [['Home'], '1 server'],
    [['Home', 'Cabin'], '2 servers'],
  ])('should count %j as %s', async (serverNames, label) => {
    renderCard('plex', { serverNames });

    expect(await screen.findByText(label)).toBeInTheDocument();
  });

  it('should say nothing was received yet on a jellyfin card', async () => {
    renderCard('jellyfin');

    expect(
      await screen.findByText(
        'Nothing received yet. Play something on Jellyfin to test it.',
      ),
    ).toBeInTheDocument();
  });

  it('should say the webhook works with the time of the last event', async () => {
    renderCard('jellyfin', {
      seenAt: new Date(Date.now() - 5 * 60 * 1000),
    });

    expect(
      await screen.findByText('Working. Last event 5 minutes ago.'),
    ).toBeInTheDocument();
  });

  it.each([
    [
      'unreadable_event',
      "Jellyfin sent something Trakt can't read. Check that the destination is Generic Destination with Send All Properties on.",
    ],
    [
      'other_server',
      'Events are coming from a different Jellyfin server. Copy this address into the server it belongs to.',
    ],
    [
      'other_account',
      'Events are coming from a different Jellyfin user. Set the user filter to your account.',
    ],
    ['not_vip', 'Webhooks are a VIP feature.'],
  ] as const)('should explain a %s refusal', async (refusal, text) => {
    renderCard('jellyfin', { seenAt: new Date(), refusal });

    expect(await screen.findByText(text)).toBeInTheDocument();
    expect(screen.queryByText(/Working\./u)).not.toBeInTheDocument();
  });

  it('should show no status line on a plex card', async () => {
    renderCard('plex', { seenAt: new Date(), refusal: 'not_vip' });
    await screen.findByRole('button');

    expect(screen.queryByText(/Jellyfin/u)).not.toBeInTheDocument();
    expect(screen.queryByText(/Working\./u)).not.toBeInTheDocument();
    expect(screen.queryByText(/VIP/u)).not.toBeInTheDocument();
  });
});
