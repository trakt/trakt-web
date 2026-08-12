import type { GlanceStripProps } from './GlanceStripProps.ts';

/**
 * The glance strip's dock form: the same tokens, arranged as a macOS-style
 * dock above the section carousel. `visibleKeys` names the sections currently
 * on screen beneath it - those tokens wear the dock's running-app dot, so the
 * reader can correlate "these tokens" with "these columns". Tokens whose
 * section is not on the current page stay quiet but present: everything the
 * title has, at a glimpse.
 */
export type GlanceDockProps = Omit<GlanceStripProps, 'links'> & {
  links: GlanceStripProps['links'] & { recap: string };
  /** The viewer's standing - behind-count, or up to date at zero. */
  recap: { remaining: number } | null;
  /** Section keys currently visible in the carousel below. */
  visibleKeys: ReadonlySet<string>;
};
