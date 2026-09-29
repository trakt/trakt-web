<script lang="ts">
  import { yirBeats } from "../persona/yirBeats";
  import { languageTag } from "$lib/features/i18n";
  import type { YirPersonaId } from "$lib/requests/models/YirPersonaId";
  import type { YirPersonaResult } from "$lib/requests/models/YirPersonaResult";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { fly } from "svelte/transition";
  import { personaAccent } from "../persona/personaAccent";
  import { personaCopy } from "../persona/personaCopy";

  const {
    monthly,
    monthIndex,
    year,
    fallback,
    isReducedMotion,
  }: {
    monthly: YirPersonaResult["monthly"];
    monthIndex: number;
    year: number;
    fallback: YirPersonaId;
    isReducedMotion: boolean;
  } = $props();

  const currentMonth = $derived(monthly.at(monthIndex));
</script>

<div class="yir-reel-month-head">
  <span class="yir-reel-month-name">
    {currentMonth
      ? toHumanMonth(
          new Date(year, currentMonth.month - 1, 1),
          languageTag(),
        )
      : ""}
  </span>
  <span class="yir-reel-month-step">
    {monthIndex + 1} / {monthly.length}
  </span>
</div>
<div class="yir-reel-month-persona">
  {#key monthIndex}
    <span
      class="yir-reel-month-persona-name"
      style:color={personaAccent(
        currentMonth?.persona ?? fallback,
      )}
      in:fly={{ y: 24, duration: isReducedMotion ? 0 : yirBeats(3.5) }}
    >
      {personaCopy(currentMonth?.persona ?? fallback).name}
    </span>
  {/key}
</div>
<ol
  class="yir-reel-months"
  style:--fill={monthly.length > 1
    ? monthIndex / (monthly.length - 1)
    : 1}
>
  {#each monthly as entry, index (entry.month)}
    <li
      class:is-on={index <= monthIndex}
      class:is-current={index === monthIndex}
      style:--dot={personaAccent(entry.persona)}
    >
      <i></i>
      {toHumanMonth(
        new Date(year, entry.month - 1, 1),
        languageTag(),
        "short",
      )}
    </li>
  {/each}
</ol>

<style lang="scss">
  .yir-reel-month-head {
    display: flex;
    align-items: baseline;
    gap: var(--ni-16);
  }

  .yir-reel-month-name {
    font-family: var(--yir-font-display);
    font-size: min(6cqi, var(--ni-48));
    line-height: 1;
    color: var(--color-yir-text-primary);
  }

  .yir-reel-month-step {
    font-family: var(--yir-font-mono);
    font-size: var(--font-size-tag);
    color: var(--color-yir-text-muted);
    font-variant-numeric: tabular-nums;
  }

  .yir-reel-month-persona {
    display: grid;
    min-height: 2.1em;
    font-size: min(9cqi, 12dvh, var(--ni-80));
    align-items: center;

    .yir-reel-month-persona-name {
      grid-area: 1 / 1;
      font-family: var(--yir-font-display);
      line-height: 1;
      max-width: 18ch;
    }
  }

  .yir-reel-months {
    --dot-size: var(--ni-14);
    --dot-room: var(--ni-8);

    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--months), minmax(0, 1fr));
    width: min(100%, var(--ni-520));
    margin: var(--ni-8) 0 0;
    padding: 0;
    list-style: none;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: calc(var(--dot-room) + var(--dot-size) / 2 - var(--ni-1));
      inset-inline: calc(50% / var(--months));
      height: var(--ni-2);
      background: var(--color-yir-separator);
    }

    &::after {
      background: var(--color-yir-accent);
      transform-origin: left center;
      transform: scaleX(var(--fill));
      transition: transform var(--transition-increment) ease-out;

      :global([dir="rtl"]) & {
        transform-origin: right center;
      }
    }

    li {
      position: relative;
      z-index: var(--layer-base);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ni-8);
      font-family: var(--yir-font-mono);
      font-size: var(--font-size-tag);
      color: var(--color-yir-text-muted);
      opacity: 0.35;
      transition: opacity var(--transition-increment);

      &.is-on {
        opacity: 1;
      }

      &.is-current {
        color: var(--color-yir-text-primary);
        font-weight: 600;
      }
    }

    i {
      width: var(--dot-size);
      height: var(--dot-size);
      border-radius: 50%;
      background: var(--dot);
      margin-block: var(--dot-room);
      border: var(--ni-2) solid var(--color-yir-background);
      transition: transform var(--transition-increment) ease-out;
    }

    .is-current i {
      transform: scale(1.6);
      box-shadow: 0 0 0 var(--ni-2) var(--dot);
    }
  }
</style>
