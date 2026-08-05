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
</script>

<button
  type="button"
  class="trakt-achievements-anchor"
  {onclick}
  aria-label={m.vip_achievements_open_label()}
>
  <span class="anchor-icon">
    <TrophyIcon />
  </span>
  <span class="anchor-label bold">
    {m.vip_achievements_anchor_label({
      unlocked: unlockedCount,
      total: totalCount,
    })}
  </span>
  <span class="anchor-caret">
    <CaretRightIcon />
  </span>
</button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-achievements-anchor {
    all: unset;
    box-sizing: border-box;
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    gap: var(--gap-xxs);

    height: var(--ni-36);
    padding: 0 var(--ni-10);
    border-radius: var(--border-radius-xxl);

    color: var(--color-text-primary);
    background: color-mix(
      in srgb,
      var(--color-achievement-accent) 15%,
      transparent
    );
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-achievement-accent) 30%, transparent);

    font-size: var(--font-size-tag);
    white-space: nowrap;

    transition:
      background-color var(--transition-increment) ease-in-out,
      transform var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background: color-mix(
          in srgb,
          var(--color-achievement-accent) 24%,
          transparent
        );
      }
    }

    &:active {
      transform: scale(0.97);
    }

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .anchor-icon {
    display: inline-flex;
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
      width: var(--ni-14);
      height: var(--ni-14);
    }
  }

  @include for-mouse {
    .trakt-achievements-anchor:hover .anchor-caret {
      opacity: 0.9;
      transform: translateX(calc(var(--rtl-sign) * var(--ni-2)));
    }
  }
</style>
