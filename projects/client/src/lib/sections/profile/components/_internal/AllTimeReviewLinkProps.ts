import type { Snippet } from 'svelte';

export type AllTimeReviewLinkProps = {
  href: string;
  label: string;
  text: string;
  icon: Snippet;
  onclick: () => void;
};
