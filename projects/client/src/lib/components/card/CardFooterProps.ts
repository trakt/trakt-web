import type { Snippet } from 'svelte';

export type CardFooterProps = Partial<ChildrenProps> & {
  actions?: Snippet;
};
