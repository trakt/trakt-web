import type { YirDetail } from '$lib/requests/models/YirDetail.ts';
import type { Snippet } from 'svelte';

export type Yir2026VipProps = {
  detail: YirDetail | null;
  slug: string;
  year: number;
  name: string;
  isMe: boolean;
  fallback: Snippet;
  onview: () => void;
};
