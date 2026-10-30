<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import ListLabel from "$lib/components/lists/ListLabel.svelte";
  import type { Snippet } from "svelte";

  /*
    Header for the two side sections (where to watch, sentiment): a label row with
    the chevron out to the full view, and any secondary detail on its own line
    beneath.

    Attribution and rank belong in the subhead - the design deliberately moves them
    out of the body, where they read as a floating line. They sit on a second row
    rather than beside the label because a sentence-case detail next to a
    tracked uppercase label breaks the small-caps rhythm the header relies on.

    The label is the page's own section label, so a section reads the same in
    the header as it does further down the page.

    Both directions use this one borderless header. It previously had a boxed
    variant for the anchored rail; that panel framing made the rail read heavier
    than the rest of the header, so it is gone.
  */
  type SectionDrilldown = {
    href: string;
    noscroll?: boolean;
    replacestate?: boolean;
    label: string;
  };

  const {
    title,
    detail,
    drilldown,
    trailing,
  }: {
    title: string;
    detail?: string | Nil;
    drilldown?: SectionDrilldown;
    trailing?: Snippet;
  } = $props();
</script>

<div class="trakt-summary-header-section-header">
  {#if drilldown}
    <!--
      The whole header is the way in, not just the chevron - a 24px caret was
      the only target for an action the entire label advertises. The caret
      stays as the affordance; the row is the hit area.
    -->
    <Link
      href={drilldown.href}
      noscroll={drilldown.noscroll}
      replacestate={drilldown.replacestate}
      label={drilldown.label}
      color="inherit"
    >
      <span class="section-label-row section-link">
        <ListLabel {title} />

        {#if trailing}
          {@render trailing()}
        {/if}

        <span class="section-caret" aria-hidden="true">
          <CaretRightIcon />
        </span>
      </span>
    </Link>
  {:else}
    <div class="section-label-row">
      <ListLabel {title} />

      {#if trailing}
        {@render trailing()}
      {/if}
    </div>
  {/if}

  {#if detail}
    <span class="section-detail">{detail}</span>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-header-section-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-3);

    max-width: 100%;
  }

  .section-label-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    /*
      Reads as ~8px: the small ActionButton pulls itself in by 8px on every side,
      so the row has to give that back to avoid the chevron sitting flush against
      the label.

      Deliberately NOT `space-between` on a full-width row. These headers sit in
      containers of very different widths - a 300px rail and a wide grid column -
      and pushing the chevron to the far edge left it stranded away from its own
      label in the wide case.
    */
    gap: var(--gap-s);

    min-width: 0;
    /*
      Matches the chevron's effective height (the small ActionButton is 40px with a
      -8px margin, so it occupies 24px). Pinned so a section WITHOUT a chevron
      still gets the same row height - otherwise its label centres in a shorter row
      and sits visibly higher than its neighbours.
    */
    min-height: var(--ni-24);
  }

  /*
    The profile header's stat-column title, lit the same way: bare at rest, a
    pill of wash on hover, the caret stepping forward. The inline padding is
    handed back as negative margin, so the words stay flush with the column;
    the pill keeps the row's 24px, so linked and plain headers line up.
  */
  .section-link {
    box-sizing: border-box;
    padding: var(--ni-4) var(--ni-8);
    margin-inline: calc(-1 * var(--ni-8));
    border-radius: var(--border-radius-pill);

    transition:
      transform var(--transition-increment) ease-out,
      background-color var(--transition-increment) ease-in-out;

    &:active {
      transform: scale(0.97);
    }

    @include for-mouse {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );

        .section-caret {
          opacity: 0.9;
          transform: translateX(calc(var(--rtl-sign) * var(--ni-2)));
        }
      }
    }
  }

  .section-detail {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
  }

  .trakt-summary-header-section-header {
    :global(a) {
      text-decoration: none;
      display: inline-flex;
      max-width: 100%;
    }
  }

  .section-caret {
    flex: none;
    display: inline-flex;
    align-items: center;

    color: var(--color-text-primary);
    opacity: 0.55;
    transition:
      transform var(--transition-increment) ease-out,
      opacity var(--transition-increment) ease-out;

    /*
      The caret wears the label's own type size, and its glyph is exactly 1em
      tall: CaretRightIcon's path spans its whole 16-unit viewBox vertically,
      so 1em of box is 1em of chevron - the same rule the ratings row uses.
      Anything larger overhangs the caps above and below and reads as
      misaligned rather than merely big.
    */
    font-size: var(--font-size-text-small);

    :global(svg) {
      height: 1em;
      width: auto;
    }
  }
</style>
