import type { Snippet } from 'svelte';

type OptionListItemBaseProps = {
  title: string;
  description?: string;
  icon?: Snippet;
  // Trailing content. When omitted, a check mark is shown for the selected
  // item; provide this to render a custom trailing indicator instead.
  end?: Snippet;
  selected?: boolean;
} & HTMLElementProps;

export type OptionListItemProps =
  | OptionListItemBaseProps
  | (OptionListItemBaseProps & HTMLAnchorProps);
