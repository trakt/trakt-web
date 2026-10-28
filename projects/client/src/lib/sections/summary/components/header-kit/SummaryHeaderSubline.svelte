<script lang="ts">
  import type { Snippet } from "svelte";

  /*
    The line directly under a strip column's header, exactly one 22px row tall
    in every column, so all five sublines - and everything beneath them - sit on
    one horizontal rhythm whatever each one holds.

    Two shapes share it. Two-tone text: a lead term in the primary colour, then
    a middot and the rest in the secondary colour ("1 friend · 3 plays",
    "JustWatch · rank 5"). Or `children`, for the columns whose line is a state
    pill with optional text beside it.
  */
  const {
    lead,
    rest,
    children,
  }: {
    lead?: string | Nil;
    rest?: string | Nil;
    children?: Snippet;
  } = $props();
</script>

<div class="trakt-summary-header-subline">
  {#if children}
    {@render children()}
  {:else}
    {#if lead}
      <span class="subline-lead">{lead}</span>
    {/if}
    {#if lead && rest}
      <span class="subline-rest" aria-hidden="true">&middot;</span>
    {/if}
    {#if rest}
      <span class="subline-rest">{rest}</span>
    {/if}
  {/if}
</div>

<style lang="scss">
  .trakt-summary-header-subline {
    display: flex;
    align-items: center;
    /* Also the space either side of the middot - a separate child, so the
       gap spaces it instead of trusting whitespace the compiler may trim. */
    gap: var(--gap-xxs);

    min-height: var(--ni-22);
    min-width: 0;
    max-width: 100%;

    white-space: nowrap;
  }

  /*
    The size sits on the spans themselves, not the row: the global typography
    sheet sizes every bare `span` to body text (14px) with an element selector,
    which beats anything they would inherit from this row. Both terms at 600 -
    at 12px a 700 lead read as a size step up from the "time left" beside the
    progress pill, and the row is meant to sit at one size. The colour split
    alone carries the two-tone.
  */
  .subline-lead,
  .subline-rest {
    font-size: var(--font-size-text-small);
    font-weight: 600;
  }

  .subline-lead {
    color: var(--color-text-primary);
  }

  .subline-rest {
    color: var(--color-text-secondary);

    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
