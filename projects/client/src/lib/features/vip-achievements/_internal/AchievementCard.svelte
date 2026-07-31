<script lang="ts">
  import FrostIcon from "$lib/components/icons/FrostIcon.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import type { VipAchievement } from "../models/VipAchievement.ts";
  import AchievementIcon from "./AchievementIcon.svelte";

  const { achievement }: { achievement: VipAchievement } = $props();

  const progressPercent = $derived(Math.round(achievement.progress * 100));
  const fmt = (value: number) => toHumanNumber(value, languageTag());

  // 0..1 across the tier ladder, driving how rich the card background reads:
  // Tier 1 is a whisper of gold, the top tier a full bloom. Locked = flat.
  const tierStrength = $derived(
    achievement.isUnlocked
      ? (achievement.tierIndex + 1) / achievement.tierCount
      : 0,
  );

  const statusText = $derived(
    achievement.isMaxed
      ? m.vip_achievements_status_completed()
      : achievement.isUnlocked
      ? m.vip_achievements_tier_label({
        tier: achievement.tierIndex + 1,
        total: achievement.tierCount,
      })
      : m.vip_achievements_status_in_progress(),
  );

  // Tiered achievements that aren't maxed reveal their remaining goals on hover.
  const hasTierGoals = $derived(
    achievement.tierCount > 1 && !achievement.isMaxed,
  );
</script>

{#snippet tierGoals()}
  <div class="trakt-achievement-tier-tooltip">
    {#each achievement.thresholds as threshold, index (index)}
      <span
        class="tier-row"
        class:is-reached={index <= achievement.tierIndex}
        class:is-next={index === achievement.tierIndex + 1}
      >
        <span>{m.vip_achievements_tier_short({ tier: index + 1 })}</span>
        <span class="tier-goal">{fmt(threshold)}</span>
      </span>
    {/each}
  </div>
{/snippet}

<div
  class="trakt-achievement-card"
  class:is-locked={!achievement.isUnlocked}
  class:is-frozen={achievement.isFrozen}
  style:--achievement-progress={`${progressPercent}%`}
  style:--tier-strength={tierStrength}
  role="group"
  aria-label={`${achievement.title} — ${statusText}`}
>
  <div class="card-body">
    <span class="card-icon">
      {#if achievement.isUnlocked}
        <AchievementIcon id={achievement.id} />
      {:else}
        <LockIcon />
      {/if}
    </span>

    <div class="card-content">
      <span class="card-title bold ellipsis">{achievement.title}</span>
      <p class="card-description" use:lineClamp={{ lines: 2 }}>
        {achievement.description}
      </p>

      <div class="card-track" aria-hidden="true">
        <span class="card-track-fill"></span>
      </div>

      <div class="card-footer">
        {#if achievement.isFrozen}
          <Tooltip content={m.vip_achievements_frozen_tooltip()} variant="compact">
            <span class="card-status is-frozen">
              <FrostIcon />
              {m.vip_achievements_frozen_label()}
            </span>
          </Tooltip>
        {:else if hasTierGoals}
          <Tooltip content={tierGoals}>
            <span class="card-status" class:is-tier={achievement.isUnlocked}>
              {statusText}
            </span>
          </Tooltip>
        {:else}
          <span class="card-status">{statusText}</span>
        {/if}

        {#if achievement.tierCount > 1}
          <span class="card-percent bold">
            {#if achievement.isMaxed}
              {fmt(achievement.value)}
            {:else}
              {fmt(achievement.value)} / {fmt(
                achievement.nextThreshold ?? achievement.value,
              )}
            {/if}
          </span>
        {/if}
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-achievement-card {
    --achievement-tint: color-mix(
      in srgb,
      var(--color-achievement-accent) 10%,
      transparent
    );

    position: relative;
    overflow: hidden;

    padding: var(--ni-24);
    border-radius: var(--border-radius-l);

    background: var(--color-card-background);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-achievement-accent) 22%, transparent);

    // Tier-scaled purple lift, borrowed from the header's VIP dazzle: the glow
    // blur widens with `--tier-strength`, so higher tiers carry a broader,
    // softer halo while Tier 1 stays tight and quiet.
    box-shadow: 0 var(--ni-2)
      calc(var(--ni-6) + var(--tier-strength, 0) * var(--ni-20))
      color-mix(in srgb, var(--purple-500) 13%, transparent);

    // Companion inner sheen behind the content. A single symmetric (RTL-safe)
    // gradient whose opacity also rides `--tier-strength`, kept faint so a grid
    // of cards reads as a purple accent rather than a purple wash.
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;

      background: radial-gradient(
        120% 90% at 50% 0%,
        color-mix(in srgb, var(--color-achievement-accent) 16%, transparent),
        transparent 65%
      );
      opacity: calc(var(--tier-strength, 0) * 0.4);
    }

    &.is-locked {
      background: var(--color-background);
      border-color: color-mix(in srgb, var(--color-foreground) 8%, transparent);
      box-shadow: none;
      opacity: 0.7;
    }
  }

  .card-body {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: var(--gap-s);
  }

  .card-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: var(--ni-56);
    height: var(--ni-56);
    border-radius: var(--border-radius-m);

    background: var(--achievement-tint);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-achievement-accent) 18%, transparent);
    color: var(--color-text-primary);

    .is-locked & {
      background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
      border-color: color-mix(in srgb, var(--color-foreground) 10%, transparent);
      color: var(--color-text-secondary);
    }

    :global(svg) {
      width: var(--ni-28);
      height: var(--ni-28);
    }
  }

  .card-content {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
  }

  .card-title {
    font-size: var(--font-size-text);

    .is-locked & {
      color: var(--color-text-secondary);
    }
  }

  .card-description {
    margin: var(--ni-4) 0 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
  }

  .card-track {
    margin-top: var(--ni-16);
    width: 100%;
    height: var(--ni-6);
    border-radius: var(--border-radius-xxl);
    overflow: hidden;

    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
  }

  .card-track-fill {
    display: block;
    height: 100%;
    width: var(--achievement-progress, 0%);
    border-radius: inherit;

    background: color-mix(
      in srgb,
      var(--color-achievement-accent) 55%,
      transparent
    );

    transition: width var(--transition-increment) ease-in-out;

    .trakt-achievement-card:not(.is-locked) & {
      background: var(--color-achievement-accent);
    }
  }

  .card-footer {
    margin-top: var(--ni-8);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-xs);
  }

  .card-status {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);

    font-size: var(--font-size-tag);
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-text-secondary);

    &.is-tier {
      color: var(--color-achievement-accent);
    }

    &.is-frozen {
      color: var(--blue-400);
    }

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }

  .card-percent {
    font-size: var(--font-size-tag);
    color: var(--color-text-primary);
  }

  // Tier-goals tooltip content is portalled out of the card, so it's styled
  // globally by a unique class rather than scoped selectors.
  :global(.trakt-achievement-tier-tooltip) {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    min-width: var(--ni-120);
  }

  :global(.trakt-achievement-tier-tooltip .tier-row) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    font-size: var(--font-size-tag);
    opacity: 0.5;
  }

  :global(.trakt-achievement-tier-tooltip .tier-row.is-reached) {
    opacity: 0.85;
  }

  :global(.trakt-achievement-tier-tooltip .tier-row.is-next) {
    opacity: 1;
    color: var(--color-achievement-accent);
    font-weight: 700;
  }

  :global(.trakt-achievement-tier-tooltip .tier-goal) {
    font-variant-numeric: tabular-nums;
  }
</style>
