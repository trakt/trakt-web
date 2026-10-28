<script lang="ts">
  import MixtapeNavbarEntry from "$lib/sections/mixtape/MixtapeNavbarEntry.svelte";
  import TodayNavbarEntry from "$lib/sections/today/TodayNavbarEntry.svelte";
  import { useNavbarState } from "../useNavbarState";

  const { state } = useNavbarState();

  const entry = $derived($state.entry);
</script>

{#if entry}
  <div class="trakt-navbar-entry-stack" data-entry={entry}>
    <div class="entry-stack-viewport">
      <div class="entry-stack-row" data-row="today">
        <TodayNavbarEntry />
      </div>
      <div class="entry-stack-row" data-row="mixtape">
        <MixtapeNavbarEntry isActive={entry === "mixtape"} />
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
    --entry-roll-duration: calc(4 * var(--transition-increment));
    --entry-roll-ease: cubic-bezier(0.65, 0, 0.35, 1);
    --entry-rest-opacity: 0.25;
    --entry-exit-fade: calc(var(--entry-roll-duration) * 0.7);
    --entry-enter-fade: calc(var(--entry-roll-duration) * 0.7);
    --entry-enter-delay: 0s;

    position: relative;
    display: flex;
    box-sizing: border-box;
    height: var(--navbar-entry-size);
    min-width: 0;

    border-radius: var(--border-radius-pill);
    background:
      var(--background-navbar-entry),
      color-mix(in srgb, var(--color-background-navbar) 75%, transparent);
    backdrop-filter: blur(var(--ni-8));
    box-shadow: var(--shadow-navbar-entry);
    color: var(--color-text-primary);

    transition: box-shadow var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        box-shadow: var(--shadow-navbar-entry-hover);
      }
    }

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
      min-width: 0;

      border-radius: inherit;
      clip-path: inset(
        calc(-1 * var(--entry-bleed)) round
          calc(var(--navbar-entry-size) / 2 + var(--entry-bleed))
      );
    }

    .entry-stack-row {
      grid-area: 1 / 1;
      display: grid;
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
    }
  }
</style>
