import type { Snippet } from 'svelte';

export type CardCoverProps = {
  src: string;
  overlaySrc?: string;
  alt: string;
  title: string;
  badge?: Snippet;
  tag?: Snippet;
  /**
   * Content docked to the cover's own edges, inside its rounded frame - the
   * frame clips, so whatever this renders is cut to the corner radius. The
   * snippet positions itself; this only decides that it lives in here.
   *
   * A control in here should carry `data-cover-edge`, which tells the cover
   * to drop its own hover outline while the pointer is on it - see
   * CardCover. Without that the card lights up as though the pointer were on
   * the episode, when it is on something else standing in front of it.
   */
  edge?: Snippet;
};
