import type { Snippet } from 'svelte';
import type { Action } from 'svelte/action';

export type ReactionsPopupProps = {
  trigger: Snippet<[attach: Action<HTMLElement>, isOpened: boolean]>;
  children: Snippet<[close: () => void]>;
  reserve: string;
  offset?: string;
};
