<script lang="ts">
  import { useDiscover } from "$lib/features/discover/useDiscover.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import MatchDrawer from "./_internal/MatchDrawer.svelte";
  import { matchLabel } from "./_internal/matchLabel";
  import { useMatch } from "./_internal/useMatch.ts";

  const { slug }: { slug: string } = $props();

  const { mode } = useDiscover();
  const { match, isLoading, band } = $derived(useMatch({ slug, mode: $mode }));

  const score = $derived($match?.score ?? 0);
  const label = $derived(matchLabel(score));

  let isOpen = $state(false);
</script>

{#if !$isLoading && $match}
  <!-- FIXME: use Link component for this + build drawer link -->
  <button
    class="trakt-match-pill"
    type="button"
    onclick={() => (isOpen = true)}
    aria-label={m.match_pill_aria_label({ score, label })}
    data-band={band}
    style:--fill={`${score}%`}
  >
    <span class="score bold">{score}<span class="suffix small">%</span></span>
    <span class="label bold">{label}</span>
  </button>
{/if}

{#if isOpen && $match}
  <MatchDrawer match={$match} onClose={() => (isOpen = false)} />
{/if}

<style lang="scss">
  .trakt-match-pill {
    --pill-accent: var(--color-foreground);
    --fill: 0%;

    align-self: flex-start;
    margin-top: var(--gap-xxs);

    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);
    padding: var(--ni-4) var(--ni-12);
    border-radius: var(--border-radius-xxl);

    // Background is the progress encoding: the score percent of the pill
    // width is filled with a soft accent tint, the rest is neutral. Reads
    // like a score bar without needing a separate UI element.
    background: linear-gradient(
      to right,
      color-mix(in srgb, var(--pill-accent) 22%, transparent) 0%,
      color-mix(in srgb, var(--pill-accent) 22%, transparent) var(--fill),
      color-mix(in srgb, var(--color-foreground) 5%, transparent) var(--fill),
      color-mix(in srgb, var(--color-foreground) 5%, transparent) 100%
    );

    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 40%, transparent);
    color: inherit;

    cursor: pointer;

    font-family: inherit;
    white-space: nowrap;

    transition:
      transform var(--transition-increment) ease-out,
      border-color var(--transition-increment) ease-out;

    &[data-band="high"] {
      border-color: color-mix(in srgb, var(--pill-accent) 60%, transparent);
    }

    &[data-band="mid"] {
      border-color: color-mix(in srgb, var(--pill-accent) 30%, transparent);
    }

    &:active {
      transform: scale(0.97);
    }
  }

  .score {
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  .suffix {
    opacity: 0.7;
    margin-left: 1px;
  }

  .label {
    white-space: nowrap;
  }
</style>
