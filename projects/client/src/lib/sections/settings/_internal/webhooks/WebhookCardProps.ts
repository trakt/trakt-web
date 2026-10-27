import type { Snippet } from 'svelte';
import type { MediaServerWebhook } from './MediaServerWebhook.ts';

export type WebhookCardProps = {
  title: string;
  description: string;
  webhook: MediaServerWebhook;
  logo: Snippet;
  instructions?: Snippet;
};
