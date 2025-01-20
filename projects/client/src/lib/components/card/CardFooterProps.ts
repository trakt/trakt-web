import type { Snippet } from 'svelte';

export type CardFooterProps = Partial<ChildrenProps> & {
  action?: Snippet;
};
