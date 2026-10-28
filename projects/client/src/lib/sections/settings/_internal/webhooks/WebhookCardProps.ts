import type { MediaSyncConnection } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';
import type { Snippet } from 'svelte';
import type { MediaServerWebhook } from './MediaServerWebhook.ts';

export type WebhookCardProps = {
  provider: MediaSyncConnection['provider'];
  title: string;
  description: string;
  webhook: MediaServerWebhook;
  logo: Snippet;
  instructions?: Snippet;
};
