<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MatchKind } from "$lib/requests/models/MatchKind.ts";
  import { matchLevel } from "./matchLevel.ts";
  import { matchTiers } from "./matchTiers.ts";

  const {
    score,
    kind,
    size = "card",
  }: {
    score: number | null;
    kind: MatchKind;
    size?: "card" | "drawer";
  } = $props();

  const level = $derived(matchLevel(score));
  const tier = $derived(level === 0 ? null : matchTiers(kind)[level]);
</script>

<div class="trakt-match-tier-heading" data-size={size}>
  {#if tier}
    {#if kind === "hype"}
      <span class="trakt-match-tier-eyebrow">{m.text_match_unreleased()}</span>
    {/if}
    <b class="trakt-match-tier-name" style:color={tier.color}>
      {tier.label()}
    </b>
    <p class="secondary">
      {kind === "hype" ? m.text_hype_basis() : m.text_match_basis_history()}
    </p>
  {:else}
    <p class="bold">{m.text_match_not_enough_data()}</p>
  {/if}
</div>

<style>
  .trakt-match-tier-heading {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    min-width: 0;

    p {
      margin: 0;
    }
  }

  .trakt-match-tier-eyebrow {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--orange-300);
  }

  .trakt-match-tier-name {
    font-size: var(--font-size-title);
    line-height: 1.1;

    [data-size="drawer"] & {
      font-size: var(--ni-28);
    }
  }
</style>
