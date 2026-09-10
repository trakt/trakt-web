import type { Snippet } from 'svelte';

type ErrorPageBaseProps = {
  /** The headline, doubling as the document title. */
  title: string;
  /** Short scene label sitting above the headline (e.g. "Intermission"). */
  kicker: string;
  /** The glyph rendered inside the page's ringed mark. */
  mark: Snippet;
  /** Buttons and links closing out the card. */
  actions?: Snippet;
};

type ErrorPagePropsWithMessage = ErrorPageBaseProps & {
  message: string;
  children?: never;
};

type ErrorPagePropsWithChildren = ErrorPageBaseProps & {
  message?: never;
} & ChildrenProps;

export type ErrorPageProps =
  | ErrorPagePropsWithMessage
  | ErrorPagePropsWithChildren;
