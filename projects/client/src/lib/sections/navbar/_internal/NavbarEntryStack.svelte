<script lang="ts">
  import MixtapeNavbarEntry from "$lib/sections/mixtape/MixtapeNavbarEntry.svelte";
  import { useDimensionObserver } from "$lib/stores/css/useDimensionObserver.ts";
  import { distinctUntilChanged, map, scan } from "rxjs";
  import { useNavbarState } from "../useNavbarState";

  const { state } = useNavbarState();

  const entry = $derived($state.entry);

  const hasShownToday = state.pipe(
    map(($navbar) => $navbar.entry === "today"),
    scan((hasShown, isToday) => hasShown || isToday, false),
    distinctUntilChanged(),
  );

  const { observedDimension: todayWidth, observeDimension: observeToday } =
    useDimensionObserver("width");
  const { observedDimension: mixtapeWidth, observeDimension: observeMixtape } =
    useDimensionObserver("width");

  const entryWidth = $derived(
    entry === "mixtape" ? $mixtapeWidth : $todayWidth,
  );
</script>

{#if entry && $state.mode === "full"}
  <div
    class="trakt-navbar-entry-stack"
    data-entry={entry}
    style:--entry-width={entryWidth > 0 ? `${entryWidth}px` : undefined}
  >
    <div class="entry-stack-viewport">
      <div class="entry-stack-row" data-row="today" use:observeToday>
        {#if $hasShownToday}
          {#await import("$lib/sections/today/TodayNavbarEntry.svelte") then { default: TodayNavbarEntry }}
            <TodayNavbarEntry />
          {/await}
        {/if}
      </div>
      <div class="entry-stack-row" data-row="mixtape" use:observeMixtape>
        <MixtapeNavbarEntry />
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-navbar-entry-stack {
    --navbar-entry-size: var(--segmented-select-segment-height);
    --navbar-entry-chip-size: var(--ni-20);
    --entry-bleed: 0px;
    --entry-roll-distance: calc(100% + 2 * var(--entry-bleed));
    --entry-roll-duration: var(--transition-duration-short);
    --entry-roll-ease: cubic-bezier(0.2, 0, 0, 1);
    --entry-rest-opacity: 0.25;
    --entry-exit-fade: calc(var(--entry-roll-duration) * 0.7);
    --entry-enter-fade: calc(var(--entry-roll-duration) * 0.7);
    --entry-enter-delay: 0s;

    @include navbar-entry-surface;

    display: flex;
    align-items: stretch;
    width: var(--entry-width, auto);
    min-width: 0;

    transition:
      width var(--entry-roll-duration) var(--entry-roll-ease),
      box-shadow var(--transition-increment) ease-in-out;

    &:has(:global(.trakt-link:focus-visible)) {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
      outline-offset: var(--ni-2);
    }

    &[data-entry="today"]:not(:has(:global(.trakt-today-navbar-entry))) {
      display: none;
    }

    .entry-stack-viewport {
      flex: 1;
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      min-width: 0;

      border-radius: inherit;
      clip-path: inset(
        calc(-1 * var(--entry-bleed)) round
          calc(var(--navbar-entry-size) / 2 + var(--entry-bleed))
      );
    }

    .entry-stack-row {
      grid-area: 1 / 1;
      justify-self: end;
      display: grid;
      width: max-content;
      min-width: 0;

      border-radius: inherit;
      opacity: var(--entry-rest-opacity);
      visibility: hidden;

      transition:
        transform var(--entry-roll-duration) var(--entry-roll-ease),
        opacity var(--entry-exit-fade) ease,
        visibility 0s linear var(--entry-roll-duration);

      &[data-row="today"] {
        transform: translateY(calc(-1 * var(--entry-roll-distance)));
      }

      &[data-row="mixtape"] {
        transform: translateY(var(--entry-roll-distance));
      }
    }

    &[data-entry="today"] .entry-stack-row[data-row="today"],
    &[data-entry="mixtape"] .entry-stack-row[data-row="mixtape"] {
      transform: translateY(0);
      opacity: 1;
      visibility: visible;
      transition:
        transform var(--entry-roll-duration) var(--entry-roll-ease),
        opacity var(--entry-enter-fade) ease var(--entry-enter-delay),
        visibility 0s;
    }

    @include for-mobile {
      --navbar-entry-chip-size: var(--ni-18);
      --entry-bleed: var(--ni-8);
      --entry-rest-opacity: 0;
      --entry-exit-fade: calc(var(--entry-roll-duration) * 0.25);
      --entry-enter-fade: calc(var(--entry-roll-duration) * 0.4);
      --entry-enter-delay: calc(var(--entry-roll-duration) * 0.5);

      width: var(--navbar-entry-size);

      .entry-stack-row {
        justify-self: stretch;
        width: auto;
      }
    }
  }
</style>
