<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { Snippet } from "svelte";
  import MediaSummary from "../MediaSummary.svelte";
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

    Both directions are drawn at desktop width, so tablet-lg keeps the shipped
    header until the responsive passes land. Mobile and tablet-sm never reach
    here - they render the v2 header.
  */
  const {
    contextualContent,
    sentiment,
    ...target
  }: SummaryHeaderProps & { contextualContent?: Snippet } = $props();
</script>

{#snippet legacyHeader()}
  <MediaSummary {...target} {contextualContent} />
{/snippet}

<RenderFor audience="all" device={["desktop"]}>
  <RenderForFeature
    flag={FeatureFlag.SummaryHeaderAnchored}
    audience="director"
  >
    {#snippet enabled()}
      <AnchoredSummaryHeader {...target} {sentiment} />
    {/snippet}

    <RenderForFeature
      flag={FeatureFlag.SummaryHeaderMasthead}
      audience="director"
    >
      {#snippet enabled()}
        <MastheadSummaryHeader {...target} {sentiment} />
      {/snippet}

      {@render legacyHeader()}
    </RenderForFeature>
  </RenderForFeature>
</RenderFor>

<RenderFor audience="all" device={["tablet-lg"]}>
  {@render legacyHeader()}
</RenderFor>
