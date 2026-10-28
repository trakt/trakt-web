<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaStudio } from "$lib/requests/models/MediaStudio";
  import type { Snippet } from "svelte";
  import MediaSummary from "../MediaSummary.svelte";
  import MediaSummaryV2 from "../v2/MediaSummary.svelte";
  import AnchoredSummaryHeader from "./AnchoredSummaryHeader.svelte";
  import MastheadSummaryHeader from "./MastheadSummaryHeader.svelte";
  import type { SummaryHeaderProps } from "./SummaryHeaderProps.ts";

  /*
    Picks which summary header a page gets, so the two revamped directions can be
    compared against real data without either call site knowing about the switch.

    Precedence is explicit and deliberate: director accounts have every feature
    flag defaulted to on (see useFeatureFlag), so "both flags enabled" is the
    common case, not an edge one. Anchored wins that tie; masthead is reached by
    turning anchored off.

    This component owns EVERY width, both for the revamped headers and for the
    fall-back. That is why the shipped mobile header is rendered here rather than
    by the pages: with the device split living in two places, a page showed the
    revamped header on desktop and the old one on a phone at the same time, and no
    single file said which header you actually get. The revamped headers carry
    their own responsive behaviour down to the smallest screens instead.
  */
  const {
    contextualContent,
    sentiment,
    studios,
    ...target
  }: SummaryHeaderProps & {
    contextualContent?: Snippet;
    /* Only the shipped mobile header needs this; neither revamp does. */
    studios: MediaStudio[];
  } = $props();
  import { fade } from "svelte/transition";
</script>

{#snippet revampedHeader(direction: "anchored" | "masthead")}
  {#if direction === "anchored"}
    <AnchoredSummaryHeader {...target} {sentiment} />
  {:else}
    <MastheadSummaryHeader {...target} {sentiment} />
  {/if}
{/snippet}

{#snippet shippedHeader()}
  <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
    <MediaSummaryV2 {...target} />
  </RenderFor>

  <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
    <MediaSummary {...target} {contextualContent} />
  </RenderFor>
{/snippet}

<!--
  Fades in whichever header wins, because all three arrive at the same moment:
  the page held the space with a silhouette while the title's data was in
  flight (see SummaryHeaderSkeleton), and swapping one for the other without a
  fade is the pop that silhouette exists to avoid.
-->
<div class="trakt-summary-header-reveal" in:fade={{ duration: 320 }}>
  <RenderForFeature flag={FeatureFlag.SummaryHeaderAnchored} audience="director">
    {#snippet enabled()}
      {@render revampedHeader("anchored")}
    {/snippet}

    <RenderForFeature flag={FeatureFlag.SummaryHeaderMasthead} audience="director">
      {#snippet enabled()}
        {@render revampedHeader("masthead")}
      {/snippet}

      {@render shippedHeader()}
    </RenderForFeature>
  </RenderForFeature>
</div>

<style>
  /* A wrapper for the fade only - it must not introduce a box of its own. */
  .trakt-summary-header-reveal {
    display: contents;
  }
</style>
