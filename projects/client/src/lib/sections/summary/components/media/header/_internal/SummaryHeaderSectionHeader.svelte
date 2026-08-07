<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import type { Snippet } from "svelte";
  import SummaryHeaderLabel from "./SummaryHeaderLabel.svelte";

  /*
    Header for the two side sections (where to watch, sentiment): a label row with
    the chevron out to the full view, and any secondary detail on its own line
    beneath.

    Attribution and rank belong in the subhead - the design deliberately moves them
    out of the body, where they read as a floating line. They sit on a second row
    rather than beside the label because a sentence-case 12px detail next to a
    tracked 10px uppercase label breaks the small-caps rhythm the header relies on.

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
  <div class="section-label-row">
    <SummaryHeaderLabel text={title} />

    {#if trailing}
      {@render trailing()}
    {/if}

    {#if drilldown}
      <ActionButton
        classList="trakt-summary-header-section-drilldown"
        href={drilldown.href}
        noscroll={drilldown.noscroll}
        replacestate={drilldown.replacestate}
        label={drilldown.label}
        style="ghost"
        size="small"
      >
        <CaretRightIcon />
      </ActionButton>
    {/if}
  </div>

  {#if detail}
    <span class="section-detail">{detail}</span>
  {/if}
</div>

<style lang="scss">
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
    gap: var(--gap-m);

    min-width: 0;
    /*
      Matches the chevron's effective height (the small ActionButton is 40px with a
      -8px margin, so it occupies 24px). Pinned so a section WITHOUT a chevron
      still gets the same row height - otherwise its label centres in a shorter row
      and sits visibly higher than its neighbours.
    */
    min-height: var(--ni-24);

    --summary-header-label-tracking: 0.16em;
  }

  .section-detail {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
  }

  .trakt-summary-header-section-header
    :global(.trakt-summary-header-section-drilldown) {
    flex: none;

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }
</style>
