<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import TrophyIcon from "$lib/components/icons/TrophyIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  const {
    unlockedCount,
    totalCount,
    onclick,
  }: {
    unlockedCount: number;
    totalCount: number;
    onclick: () => void;
  } = $props();

  const counts = $derived({ unlocked: unlockedCount, total: totalCount });
</script>

<button
  type="button"
  class="trakt-achievements-anchor"
  {onclick}
  aria-label={`${m.vip_achievements_open_label()}, ${m.vip_achievements_count(counts)}`}
>
  <span class="anchor-icon">
    <TrophyIcon />
  </span>
  <span class="anchor-label">{m.vip_achievements_anchor_label(counts)}</span>
  <span class="anchor-caret">
    <CaretRightIcon />
  </span>
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // A quiet text link at rest, sized and coloured like the kicker it sits in.
  // The padding is the hit area: negative inline margins keep the visible
  // text on the kicker's rhythm, and on hover that area lights up as a pill.
  .trakt-achievements-anchor {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;

    display: inline-flex;
    flex: none;
    align-items: center;
    gap: var(--ni-6);

    block-size: calc(var(--ni-24) + var(--ni-2));
    padding-inline: var(--ni-6);
    margin-inline: calc(var(--ni-6) * -1);
    border-radius: var(--border-radius-pill);

    color: var(--color-text-secondary);
    font-size: var(--font-size-text-small);
    font-weight: 700;
    letter-spacing: 0.16em;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;

    transition:
      background-color var(--transition-increment) ease-out,
      color var(--transition-increment) ease-out,
      transform var(--transition-increment) ease-out;

    @include for-tablet-sm-and-below {
      block-size: var(--ni-24);
      font-size: var(--font-size-tag);
    }

    @include for-mouse {
      &:hover {
        color: var(--color-text-primary);
        background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
      }
    }

    &:active {
      transform: scale(0.97);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-foreground);
      outline-offset: var(--ni-2);
    }
  }

  .anchor-icon {
    display: inline-flex;
    color: var(--color-text-primary);

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);

      @include for-tablet-sm-and-below {
        width: var(--ni-10);
        height: var(--ni-10);
      }
    }
  }

  // A bare span picks up the global 14px span size, so it inherits the link's
  // kicker type explicitly.
  .anchor-label {
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
  }

  // Mirrors the avatar pill's caret: fades in and nudges along the reading
  // direction on hover. `--rtl-sign` keeps the nudge direction-aware, since
  // transforms are not.
  .anchor-caret {
    display: inline-flex;
    opacity: 0.55;

    transition:
      transform var(--transition-increment) ease-out,
      opacity var(--transition-increment) ease-out;

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }
  }

  @include for-mouse {
    .trakt-achievements-anchor:hover .anchor-caret {
      opacity: 0.9;
      transform: translateX(calc(var(--rtl-sign) * var(--ni-2)));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-achievements-anchor,
    .anchor-caret {
      transition: none;
    }
  }
</style>
