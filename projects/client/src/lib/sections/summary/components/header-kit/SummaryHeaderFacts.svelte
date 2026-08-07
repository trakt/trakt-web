<script lang="ts">
  import SummaryHeaderLabel from "./SummaryHeaderLabel.svelte";
  import type { SummaryHeaderFact } from "./SummaryHeaderFact.ts";

  /*
    Two renderings of one fact list.

    - `strip` (anchored) is a ruled row of label-over-value stacks. The rules
      above and below are the frame that roots the facts; without them the
      metadata reads as floating, which is the exact bug being fixed.
    - `inline` (masthead) collapses to a single meta line, using each fact's
      self-describing `inlineValue` because there are no labels to carry meaning.
  */
  const SEPARATOR = "·";

  const {
    facts,
    variant = "strip",
  }: {
    facts: ReadonlyArray<SummaryHeaderFact>;
    variant?: "strip" | "inline";
  } = $props();

  const inlineText = $derived(
    facts.map((fact) => fact.inlineValue).join(` ${SEPARATOR} `),
  );
</script>

{#if facts.length > 0}
  {#if variant === "inline"}
    <p class="trakt-summary-header-facts" data-variant="inline">
      {inlineText}
    </p>
  {:else}
    <dl class="trakt-summary-header-facts" data-variant="strip">
      {#each facts as fact (fact.key)}
        <div class="fact">
          <dt><SummaryHeaderLabel text={fact.label} /></dt>
          <dd class="fact-value">{fact.value}</dd>
        </div>
      {/each}
    </dl>
  {/if}
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-header-facts {
    margin: 0;

    &[data-variant="strip"] {
      display: flex;
      flex-wrap: wrap;
      /*
        Fluid, so the facts stay one row for as long as they can and then wrap on
        their own. The 44px gap they were drawn with forced a wrap early on narrow
        screens, which read as two half-empty rows.
      */
      gap: clamp(var(--gap-m), 3vw, var(--gap-xxl));

      padding: var(--ni-18) 0;

      /*
        Held to the same measure as the prose below, so the rules never run wider
        than the text they frame - a rule that overshoots the column's reading
        width reads as a page divider rather than as part of this block.
      */
      max-width: var(--facts-measure, none);

      /*
        Deliberately fainter than --color-border. These two rules are structural,
        not decorative - they only need to suggest where the facts begin and end.
        At full border strength they read as a table and dominate the data they are
        meant to frame. Tune via --summary-header-hairline on the header root.
      */
      border-top: var(--ni-1) solid var(--summary-header-hairline);
      border-bottom: var(--ni-1) solid var(--summary-header-hairline);
    }

    &[data-variant="inline"] {
      font-size: var(--font-size-text);
      color: var(--color-text-secondary);
      text-wrap: pretty;
    }

  }

  .fact {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .fact-value {
    margin: 0;

    font-size: var(--ni-16);
    font-weight: 600;
    color: var(--color-text-primary);
  }
</style>
