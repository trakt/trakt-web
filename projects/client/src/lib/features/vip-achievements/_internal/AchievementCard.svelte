<script lang="ts">
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toGroupedNumber } from "$lib/utils/formatting/number/toGroupedNumber.ts";
  import type { VipAchievement } from "../models/VipAchievement.ts";
  import AchievementIcon from "./AchievementIcon.svelte";

  const {
    achievement,
    revealIndex,
  }: {
    achievement: VipAchievement;
    /** Set for a fresh unlock: its place in the drawer's reveal sequence. */
    revealIndex: number | null;
  } = $props();

  const fmt = (value: number) => toGroupedNumber(value, languageTag());

  const isNew = $derived(revealIndex !== null);
  // A one-step goal ("Rate something 5/5") has no progress worth a bar.
  const hasProgress = $derived((achievement.nextThreshold ?? 0) > 1);
  const progressPercent = $derived(Math.round(achievement.progress * 100));

  // 0..1 across the tier ladder: the medal's glow widens as tiers stack up.
  const tierStrength = $derived(
    achievement.isUnlocked
      ? (achievement.tierIndex + 1) / achievement.tierCount
      : 0,
  );

  const tierText = $derived.by(() => {
    if (!achievement.isUnlocked) return m.vip_achievements_locked();
    if (achievement.isMaxed) return m.vip_achievements_status_completed();
    return m.vip_achievements_tier_label({
      tier: achievement.tierIndex + 1,
      total: achievement.tierCount,
    });
  });
</script>

<article
  class="trakt-achievement-card"
  class:is-locked={!achievement.isUnlocked}
  class:is-maxed={achievement.isMaxed}
  class:is-new={isNew}
  style:--achievement-progress={`${progressPercent}%`}
  style:--tier-strength={tierStrength}
  style:--reveal-index={revealIndex ?? 0}
  aria-label={`${achievement.title}, ${tierText}`}
>
  <div class="card-medal" aria-hidden="true">
    <span class="medal-face">
      <AchievementIcon id={achievement.id} />
    </span>
    {#if !achievement.isUnlocked}
      <span class="medal-lock">
        <LockIcon />
      </span>
    {/if}
  </div>

  <div class="card-content">
    <div class="card-heading">
      <span class="card-title bold ellipsis">{achievement.title}</span>
      {#if isNew}
        <span class="card-new">{m.vip_achievements_new()}</span>
      {/if}
    </div>

    <div class="card-tier">
      <span class="tier-pips" aria-hidden="true">
        {#each achievement.thresholds as threshold, index (threshold)}
          <span
            class="tier-pip"
            class:is-reached={index <= achievement.tierIndex}
          ></span>
        {/each}
      </span>
      <span class="tier-text">{tierText}</span>
    </div>

    <p class="card-description" use:lineClamp={{ lines: 2 }}>
      {achievement.description}
    </p>

    {#if achievement.nextStep && achievement.nextThreshold !== null}
      <div class="card-next">
        {#if hasProgress}
          <div class="card-track" aria-hidden="true">
            <span class="card-track-fill"></span>
          </div>
        {/if}
        <div class="card-next-row">
          <span class="card-next-step">
            <span class="card-next-label">
              {achievement.isUnlocked
                ? m.vip_achievements_next_tier()
                : m.vip_achievements_to_unlock()}
            </span>
            <span class="card-next-text">{achievement.nextStep}</span>
          </span>
          {#if hasProgress}
            <span class="card-next-count">
              {fmt(achievement.value)} / {fmt(achievement.nextThreshold)}
            </span>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-achievement-card {
    --medal-size: var(--ni-52);
    --medal-accent: var(--color-achievement-accent);
    --muted-fill: color-mix(
      in srgb,
      var(--color-foreground) 6%,
      var(--color-card-background)
    );

    position: relative;
    overflow: hidden;

    display: flex;
    align-items: flex-start;
    gap: var(--gap-s);

    padding: var(--ni-16);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    // Earned cards carry a faint wash of the medal's colour from the top,
    // stronger as tiers stack up. Locked cards stay flat.
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: inherit;
      background: radial-gradient(
        120% 90% at 50% 0%,
        color-mix(in srgb, var(--medal-accent) 18%, transparent),
        transparent 65%
      );
      opacity: calc(0.25 + var(--tier-strength, 0) * 0.5);
    }

    &.is-locked {
      background: var(--muted-fill);
      box-shadow: none;

      &::before {
        content: none;
      }
    }
  }

  .card-medal {
    position: relative;
    flex: none;
    inline-size: var(--medal-size);
    block-size: var(--medal-size);
  }

  .medal-face {
    position: relative;
    overflow: hidden;

    display: grid;
    place-items: center;
    inline-size: 100%;
    block-size: 100%;
    border-radius: 50%;

    color: var(--shade-10);
    background: radial-gradient(
      circle at 32% 28%,
      color-mix(in srgb, var(--medal-accent) 55%, var(--shade-10)),
      var(--medal-accent) 58%,
      color-mix(in srgb, var(--medal-accent) 70%, var(--shade-1000))
    );
    box-shadow:
      inset 0 0 0 var(--ni-1) color-mix(in srgb, var(--shade-10) 28%, transparent),
      0 0 calc(var(--ni-4) + var(--tier-strength, 0) * var(--ni-16))
        color-mix(in srgb, var(--medal-accent) 45%, transparent);

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
    }

    // Every tier earned: the medal gets a framed ring.
    .is-maxed & {
      box-shadow:
        inset 0 0 0 var(--ni-1) color-mix(in srgb, var(--shade-10) 28%, transparent),
        0 0 0 var(--ni-2) var(--color-card-background),
        0 0 0 calc(var(--ni-2) + var(--ni-1) * 1.5) var(--medal-accent),
        0 0 var(--ni-20) color-mix(in srgb, var(--medal-accent) 45%, transparent);
    }

    .is-locked & {
      color: var(--color-text-secondary);
      background: var(--muted-fill);
      box-shadow: inset 0 0 0 var(--ni-1)
        color-mix(in srgb, var(--color-foreground) 10%, transparent);

      :global(svg) {
        opacity: 0.45;
      }
    }
  }

  .medal-lock {
    position: absolute;
    inset-block-end: calc(var(--ni-2) * -1);
    inset-inline-end: calc(var(--ni-2) * -1);

    display: grid;
    place-items: center;
    inline-size: var(--ni-20);
    block-size: var(--ni-20);
    border-radius: 50%;

    color: var(--color-text-secondary);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }
  }

  .card-content {
    position: relative;
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
  }

  .card-heading {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-width: 0;
  }

  .card-title {
    font-size: var(--font-size-text);

    .is-locked & {
      color: var(--color-text-secondary);
    }
  }

  .card-new {
    flex: none;
    padding: var(--ni-2) var(--ni-6);
    border-radius: var(--border-radius-pill);

    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--shade-10);
    background: var(--medal-accent);
  }

  .card-tier {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .tier-pips {
    display: flex;
    gap: var(--ni-4);
  }

  .tier-pip {
    inline-size: var(--ni-6);
    block-size: var(--ni-6);
    border-radius: 50%;
    background: color-mix(in srgb, var(--color-foreground) 18%, transparent);

    &.is-reached {
      background: var(--color-text-primary);
    }
  }

  .tier-text {
    font-size: var(--font-size-tag);
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-text-primary);

    .is-locked & {
      color: var(--color-text-secondary);
    }

    .is-maxed & {
      color: var(--medal-accent);
    }
  }

  .card-description {
    margin: 0;
    color: var(--color-text-secondary);
    font-size: var(--font-size-tag);
  }

  .card-next {
    display: flex;
    flex-direction: column;
    gap: var(--ni-6);
    margin-block-start: var(--ni-4);
  }

  .card-track {
    inline-size: 100%;
    block-size: var(--ni-4);
    border-radius: var(--border-radius-pill);
    overflow: hidden;
    background: color-mix(in srgb, var(--color-foreground) 12%, transparent);
  }

  .card-track-fill {
    display: block;
    block-size: 100%;
    inline-size: var(--achievement-progress, 0%);
    border-radius: inherit;
    background: color-mix(in srgb, var(--color-foreground) 55%, transparent);

    .is-locked & {
      background: color-mix(in srgb, var(--color-foreground) 30%, transparent);
    }
  }

  .card-next-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--gap-xs);
  }

  .card-next-step {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    column-gap: var(--gap-xxs);
    min-width: 0;
  }

  .card-next-label,
  .card-next-text,
  .card-next-count {
    font-size: var(--font-size-tag);
  }

  .card-next-label {
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  .card-next-text {
    color: var(--color-text-primary);

    .is-locked & {
      color: var(--color-text-secondary);
    }
  }

  .card-next-count {
    flex: none;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--color-text-secondary);
  }

  // A fresh unlock pops its medal in, one after another, then a single shine
  // passes over it. Everything already seen stays still.
  @media (prefers-reduced-motion: no-preference) {
    .is-new .medal-face {
      animation: medal-pop 560ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
      animation-delay: calc(360ms + var(--reveal-index) * 70ms);

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          115deg,
          transparent 35%,
          color-mix(in srgb, var(--shade-10) 55%, transparent) 50%,
          transparent 65%
        );
        transform: translateX(-120%);
        animation: medal-shine 700ms ease-out both;
        animation-delay: calc(820ms + var(--reveal-index) * 70ms);
      }
    }

    .is-new .card-new {
      animation: new-in 320ms ease-out both;
      animation-delay: calc(700ms + var(--reveal-index) * 70ms);
    }
  }

  @keyframes medal-pop {
    from {
      transform: scale(0.4);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes medal-shine {
    to {
      transform: translateX(120%);
    }
  }

  @keyframes new-in {
    from {
      transform: translateY(var(--ni-4));
      opacity: 0;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }
</style>
