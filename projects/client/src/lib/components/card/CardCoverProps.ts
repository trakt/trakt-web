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
   */
  edge?: Snippet;
};
