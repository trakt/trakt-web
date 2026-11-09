import type { Snippet } from 'svelte';

export type LegalPageProps = {
  title: string;
  lastUpdated: string;
  intro?: Snippet;
  summary?: Snippet;
  children?: Snippet;
};
