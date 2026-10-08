import type { Snippet } from 'svelte';

export type GameCurtainProps = {
  isOpen: boolean;
  lines: ReadonlyArray<string>;
  ontyped: (lines: ReadonlyArray<string>) => void;
  children?: Snippet;
};
