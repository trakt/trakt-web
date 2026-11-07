<script lang="ts">
  import type { MatchTabProps } from "./MatchTabProps.ts";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { MATCH_LOW_THRESHOLD } from "./constants/matchRing.ts";
  import HypeStories from "./HypeStories.svelte";
  import { matchHeadline } from "./matchHeadline.ts";
  import { matchLevel } from "./matchLevel.ts";
  import MatchStories from "./MatchStories.svelte";
  import { matchTiers } from "./matchTiers.ts";
  import MatchOrbit from "./MatchOrbit.svelte";
  import MatchReasons from "./MatchReasons.svelte";
  import MatchRing from "./MatchRing.svelte";
  import MatchTaste from "./MatchTaste.svelte";
  import MatchTierHeading from "./MatchTierHeading.svelte";
  import MatchTierLadder from "./MatchTierLadder.svelte";
  import { useInsightsCard } from "../useInsightsCard.ts";

  const { score, kind, reasons, taste, media }: MatchTabProps = $props();

  const { isInsightsCard } = useInsightsCard();

  const level = $derived(matchLevel(score, kind));
  const storyColor = $derived(
    level === 0 ? undefined : matchTiers(kind)[level].color,
  );

  const headline = $derived(
    matchHeadline({
      kind,
      reasons,
      taste,
      rating: media.rating,
      votes: media.votes,
      locale: getLocale(),
    }),
  );

  const hasReasons = $derived(
    score >= MATCH_LOW_THRESHOLD && !($isInsightsCard && kind === "hype"),
  );
</script>

<div class="trakt-match-tab">
  {#if $isInsightsCard}
    <div class="trakt-match-tier">
      <div class="trakt-match-score">
        <MatchOrbit {score} {kind} size="drawer" />
        <MatchTierHeading {score} {kind} {headline} size="drawer" />
      </div>
      <MatchTierLadder {score} {kind} />
    </div>
  {:else}
    <div class="trakt-match-score">
      <MatchRing {score} size="drawer" />
      <div class="trakt-match-copy">
        <p class="bold">{m.text_match_better_than({ percent: score })}</p>
        <RenderFor audience="vip">
          <p class="secondary">{m.text_match_basis_history()}</p>
        </RenderFor>
        <RenderFor audience="free">
          <p class="secondary">{m.text_match_basis_free()}</p>
        </RenderFor>
      </div>
    </div>
  {/if}

  {#if $isInsightsCard}
    <div class="trakt-match-stories-slot" style:--insights-story-color={storyColor}>
      {#if kind === "hype"}
        <HypeStories {reasons} {taste} {media} />
      {:else}
        <MatchStories {taste} {media} hasSources={hasReasons} />
      {/if}
    </div>
  {:else}
    <MatchTaste {taste} />

    <RenderFor audience="vip">
      {#if hasReasons}
        <MatchReasons type={media.type} id={media.id} />
      {/if}
    </RenderFor>
  {/if}

  <RenderFor audience="free">
    <UpsellCta source="sentiment">
      {m.text_vip_upsell_sentiment()}
    </UpsellCta>
  </RenderFor>
</div>

<style>
  .trakt-match-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }

  .trakt-match-tier {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .trakt-match-score {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .trakt-match-copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    min-width: 0;
  }
</style>
