import type { Snippet } from 'svelte';

export type NavbarHeaderState = {
  title: string;
  metaInfo?: string | Snippet;
  actions?: Snippet;
  back?: {
    href: string;
    label: string;
  };
};
