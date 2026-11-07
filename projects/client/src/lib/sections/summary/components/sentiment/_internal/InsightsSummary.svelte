<script lang="ts">
  import type { InsightsSummaryProps } from "./InsightsSummaryProps.ts";
  import ArrowRightIcon from "$lib/components/icons/ArrowRightIcon.svelte";
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import RealityTierPill from "$lib/sections/components/reality-check/RealityTierPill.svelte";
  import RealityTierPillSkeleton from "$lib/sections/components/reality-check/RealityTierPillSkeleton.svelte";
  import { stripMarkdownLinks } from "$lib/utils/markdown/stripMarkdownLinks.ts";
  import { clampItemsToFit } from "./clampItemsToFit.ts";
  import MatchTierHeading from "./MatchTierHeading.svelte";
  import { mapToSentimentSummary } from "./mapToSentimentSummary";

  const SKELETON_LINE_WIDTHS = ["100%", "88%", "94%", "56%"];

  const {
    sentiment,
    realityCheck,
    match,
    kind = "match",
    hasRing = false,
    hasDrawer = true,
  }: InsightsSummaryProps = $props();

  const isLoading = $derived(
    sentiment === undefined || realityCheck === undefined,
  );

  const summary = $derived(
    sentiment
      ? mapToSentimentSummary({
          pros: sentiment.aspect.pros,
          cons: sentiment.aspect.cons,
        })
      : null,
  );
</script>

<div
  class="trakt-sentiment-summary"
  class:has-ring={hasRing}
  class:has-floating-footer={!isLoading && !realityCheck}
>
  {#if isLoading}
    <Skeleton width="55%" height="var(--ni-18)" />

    <div class="trakt-sentiment-skeleton-lines">
      {#each SKELETON_LINE_WIDTHS as width (width)}
        <Skeleton {width} height="var(--ni-14)" />
      {/each}
    </div>
  {:else if summary}
    <span class="capitalize bold">{summary.text}</span>

    <div class="trakt-sentiment-aspects">
      <ul use:clampItemsToFit={summary.aspects}>
        {#each summary.aspects as aspect}
          <li><p class="capitalize">{aspect}</p></li>
        {/each}
      </ul>
    </div>
  {:else if realityCheck}
    <span class="bold">{m.header_reality_check()}</span>

    <div class="trakt-sentiment-aspects">
      <p use:lineClamp={{ lines: 5 }}>
        <InlineMarkdown text={stripMarkdownLinks(realityCheck.summary)} />
      </p>
    </div>
  {:else if match === undefined}
    <Skeleton width="80%" height="var(--ni-18)" />
  {:else}
    <MatchTierHeading score={match} {kind} />
  {/if}

  <div class="trakt-sentiment-footer">
    {#if isLoading}
      <RealityTierPillSkeleton />
    {:else}
      {#if realityCheck}
        <RealityTierPill tier={realityCheck.verdict} />
      {/if}
      {#if hasDrawer}
        <span class="trakt-sentiment-arrow"><ArrowRightIcon /></span>
      {/if}
    {/if}
  </div>
</div>

<style>
  .trakt-sentiment-summary {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-s);

    height: 100%;
    width: 100%;

    overflow: hidden;
    position: relative;

    --width-ring-reserve: calc(var(--width-sentiment-match-slot) + var(--gap-xs));

    &.has-floating-footer {
      ul {
        --clamp-items-end-reserve: calc(var(--ni-24) + var(--gap-xs));
      }

      .trakt-sentiment-footer {
        position: absolute;
        bottom: 0;
        inset-inline-end: 0;
      }
    }

    &.has-ring > .bold:first-child,
    &.has-ring > :global(.trakt-match-tier-heading),
    &.has-ring li:first-child {
      padding-inline-end: var(--width-ring-reserve);
    }

    &.has-ring .trakt-sentiment-aspects > p::before {
      content: "";
      float: inline-end;
      width: var(--width-ring-reserve);
      height: 2lh;
    }
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    height: 100%;
    overflow: hidden;

    margin: 0;
    padding: 0;
    padding-inline-start: var(--ni-18);

    font-size: var(--font-size-text);

    color: color-mix(in srgb, var(--color-text-secondary) 50%, transparent);

    p.capitalize {
      color: var(--color-text-primary);
    }
  }

  .trakt-sentiment-aspects {
    flex: 1;
    min-height: 0;
    overflow: hidden;

    color: var(--color-text-primary);
  }

  .trakt-sentiment-skeleton-lines {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .trakt-sentiment-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);

    min-height: var(--ni-24);
  }

  .trakt-sentiment-arrow {
    display: flex;
    flex-shrink: 0;
    margin-inline-start: auto;
  }
</style>
