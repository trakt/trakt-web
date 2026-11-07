<script lang="ts">
  import type { MatchKind } from "$lib/requests/models/MatchKind.ts";
  import { matchLevel } from "./matchLevel.ts";
  import { matchTiers } from "./matchTiers.ts";

  const { score, kind }: { score: number; kind: MatchKind } = $props();

  const level = $derived(matchLevel(score));
  const steps = $derived(
    ([1, 2, 3, 4] as const).map((step) => ({
      step,
      tier: matchTiers(kind)[step],
    })),
  );
</script>

<ol class="trakt-match-tier-ladder">
  {#each steps as { step, tier } (step)}
    <li
      class:is-current={step === level}
      style:--match-tier-color={tier.color}
      aria-current={step === level ? "true" : undefined}
    >
      <span class="trakt-match-tier-bar"></span>
      <span class="trakt-match-tier-label">{tier.label()}</span>
    </li>
  {/each}
</ol>

<style>
  .trakt-match-tier-ladder {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--gap-xs);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xxs);
    min-width: 0;
  }

  .trakt-match-tier-bar {
    width: 100%;
    height: var(--ni-6);
    border-radius: var(--border-radius-xs);
    background: color-mix(in srgb, var(--color-text-secondary) 18%, transparent);
    transition: background-color calc(2 * var(--transition-increment)) ease-out;

    .is-current & {
      background: var(--match-tier-color);
    }
  }

  .trakt-match-tier-label {
    font-size: var(--font-size-tag);
    color: var(--color-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;

    .is-current & {
      font-weight: 700;
      color: var(--color-text-primary);
    }
  }
</style>
