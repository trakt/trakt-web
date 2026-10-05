<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";
  import type { TodayDayLinksProps } from "./TodayDayLinksProps.ts";

  const { options, value, onChange }: TodayDayLinksProps = $props();
</script>

<div
  class="trakt-today-day-links"
  role="group"
  aria-label={m.label_today_day()}
  data-dpad-navigation={DpadNavigationType.List}
>
  {#each options as option (option.value)}
    {@const isActive = option.value === value}
    <button
      type="button"
      class="day-link"
      class:is-active={isActive}
      aria-pressed={isActive}
      data-dpad-navigation={DpadNavigationType.Item}
      onclick={() => onChange(option.value)}
    >
      <span class="day-dot" aria-hidden="true"></span>
      <span class="bold day-label">{option.label}</span>
      {#if option.count === null}
        <span class="small day-count">
          <Skeleton height="var(--ni-12)" />
        </span>
      {:else if option.count !== undefined}
        <span class="small day-count">
          {toHumanNumber(option.count, getLocale())}
        </span>
      {/if}
    </button>
  {/each}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-day-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs) var(--gap-l);
  }

  .day-link {
    all: unset;

    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    padding-block: var(--ni-6);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    color: var(--color-text-secondary);
    transition: color var(--transition-increment) ease-in-out;

    .day-label {
      color: inherit;
    }

    .day-count {
      display: inline-flex;
      align-items: center;
      min-width: 2ch;
      color: var(--color-text-secondary);
      opacity: 0.7;
      font-variant-numeric: tabular-nums;
    }

    .day-dot {
      width: var(--ni-6);
      height: var(--ni-6);
      border-radius: 50%;

      background: var(--purple-500);
      box-shadow: 0 0 var(--ni-8)
        color-mix(in srgb, var(--purple-500) 80%, transparent);

      opacity: 0;
      transform: scale(0.4);
      transition: var(--transition-increment) ease-out;
      transition-property: opacity, transform;
    }

    &.is-active {
      color: var(--color-text-primary);
      cursor: default;

      .day-count {
        color: var(--color-text-emphasis);
        opacity: 1;
      }

      .day-dot {
        opacity: 1;
        transform: none;
      }
    }

    @include for-mouse {
      &:not(.is-active):hover {
        color: var(--color-text-primary);
      }
    }

    &:focus-visible {
      outline: var(--ni-2) solid var(--color-text-emphasis);
      outline-offset: var(--ni-2);
      border-radius: var(--border-radius-s);
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;

      .day-dot {
        transition: none;
      }
    }
  }
</style>
