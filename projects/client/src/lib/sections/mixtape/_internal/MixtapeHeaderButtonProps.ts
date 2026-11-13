import type { Snippet } from 'svelte';

export type MixtapeHeaderButtonProps = {
  href: string;
  label: string;
  isDisabled?: boolean;
  replace?: boolean;
  children: Snippet;
};
