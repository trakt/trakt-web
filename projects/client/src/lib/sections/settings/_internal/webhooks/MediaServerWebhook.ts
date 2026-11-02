import type { MediaSyncWebhookRefusal } from '$lib/requests/media-sync/models/MediaSyncConnection.ts';

export type MediaServerWebhook = {
  url: string;
  serverNames: ReadonlyArray<string>;
  seenAt: Date | null;
  refusal: MediaSyncWebhookRefusal | null;
};
