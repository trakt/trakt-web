<script lang="ts">
  import SkeletonShimmer from "./SkeletonShimmer.svelte";
  import type { Snippet } from "svelte";

  /**
   * One element of a staggered reveal, with its stand-in pinned to its own box.
   *
   * Wrap the real content; do not build a second copy of the layout beside it.
   * The stand-in is an overlay inside this same box, so the two are the same
   * rectangle by construction - which is the whole reason this component
   * exists rather than a skeleton screen that has to be kept in step by hand.
   *
   * The cascade is driven entirely by `data-reveal` on an ancestor (see
   * `style/animations/index.css`); this component adds no timers of its own.
   */
  const {
    wave,
    radius = "var(--border-radius-s)",
    inset = "0",
    children,
  }: {
    /** Running order, 1 (top of the page) to 5. */
    wave: 1 | 2 | 3 | 4 | 5;
    /** Match the content's own corner. */
    radius?: string;
    /** Trim the stand-in against the box, e.g. off a text line's leading. */
    inset?: string;
  } & ChildrenProps & { children: Snippet } = $props();
</script>

<div class="trakt-reveal-wave" data-reveal-wave={wave}>
  <div class="reveal-content">
    {@render children()}
  </div>

  <SkeletonShimmer {radius} {inset} />
</div>

<style lang="scss">
  .trakt-reveal-wave {
    /* The stand-in pins to this box. */
    position: relative;

    /* Inherited from the caller so wrapping a flex or grid child does not
       change what it was. */
    display: var(--reveal-display, block);
    width: var(--reveal-width, auto);
  }

  .reveal-content {
    display: var(--reveal-content-display, block);
  }
</style>
