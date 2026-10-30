<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { toVipStreakLadder } from "$lib/features/vip-veteran/toVipStreakLadder.ts";
  import { toVipVeteranLabel } from "$lib/features/vip-veteran/toVipVeteranLabel.ts";
  import type { VipVeteran } from "$lib/requests/models/VipVeteran.ts";

  const { veteran }: { veteran: VipVeteran } = $props();

  const ladder = $derived(toVipStreakLadder(veteran));

  function toRungYears(tier: number) {
    return tier === 1
      ? m.text_vip_streak_rung_one()
      : m.text_vip_streak_rung_other({ years: String(tier) });
  }

  const nextLabel = $derived.by(() => {
    const { next } = ladder;
    if (!next) return m.text_vip_streak_top();

    const title = toVipVeteranLabel(next.title);
    return next.yearsLeft === 1
      ? m.text_vip_streak_next_one({ title })
      : m.text_vip_streak_next_other({
        title,
        years: String(next.yearsLeft),
      });
  });
</script>

<div class="trakt-vip-streak-ladder">
  <ol class="ladder-rungs">
    {#each ladder.rungs as rung (rung.tier)}
      <li
        class="ladder-rung"
        class:is-reached={rung.isReached}
        class:is-current={rung.isCurrent}
        data-tone={rung.tone}
        aria-current={rung.isCurrent ? "step" : undefined}
      >
        <span class="rung-dot" aria-hidden="true"></span>
        <span class="rung-title uppercase bold">
          {toVipVeteranLabel(rung.title)}
        </span>
        <span class="rung-years secondary">{toRungYears(rung.tier)}</span>
      </li>
    {/each}
  </ol>

  <p class="ladder-next secondary">{nextLabel}</p>
</div>

<style>
  .trakt-vip-streak-ladder {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .ladder-rungs {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ladder-rung {
    --rung-color: var(--color-glow-vip-badge-vip);

    display: grid;
    grid-template-columns: var(--ni-16) 1fr auto;
    align-items: center;
    gap: var(--gap-s);

    opacity: 0.45;

    &[data-tone="deep"] {
      --rung-color: var(--color-glow-vip-badge-deep);
    }

    &[data-tone="copper"] {
      --rung-color: var(--color-glow-vip-badge-copper);
    }

    &[data-tone="silver"] {
      --rung-color: var(--color-glow-vip-badge-silver);
    }

    &[data-tone="gold"] {
      --rung-color: var(--color-glow-vip-badge-gold);
    }

    &.is-reached {
      opacity: 1;
    }

    &.is-current .rung-dot {
      box-shadow: 0 0 0 var(--ni-4)
        color-mix(in srgb, var(--rung-color) 35%, transparent);
    }
  }

  .rung-dot {
    width: var(--ni-12);
    height: var(--ni-12);
    border-radius: 50%;
    background-color: var(--rung-color);
  }

  .ladder-next {
    text-align: center;
  }
</style>
