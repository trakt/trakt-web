<script lang="ts">
  import type { MatchTabProps } from "./MatchTabProps.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { MATCH_LOW_THRESHOLD } from "./constants/matchRing.ts";
  import MatchOrbit from "./MatchOrbit.svelte";
  import MatchReasons from "./MatchReasons.svelte";
  import MatchRing from "./MatchRing.svelte";
  import MatchTaste from "./MatchTaste.svelte";
  import MatchTierHeading from "./MatchTierHeading.svelte";
  import MatchTierLadder from "./MatchTierLadder.svelte";
  import { useInsightsCard } from "../useInsightsCard.ts";

  const { score, kind, taste, type, id }: MatchTabProps = $props();

  const { isInsightsCard } = useInsightsCard();

  const hasReasons = $derived(
    score >= MATCH_LOW_THRESHOLD && !($isInsightsCard && kind === "hype"),
  );
</script>

<div class="trakt-match-tab">
  {#if $isInsightsCard}
    <div class="trakt-match-tier">
      <div class="trakt-match-score">
        <MatchOrbit {score} {kind} size="drawer" />
        <MatchTierHeading {score} {kind} size="drawer" />
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

  <MatchTaste {taste} />

  <RenderFor audience="vip">
    {#if hasReasons}
      <MatchReasons {type} {id} />
    {/if}
  </RenderFor>

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
