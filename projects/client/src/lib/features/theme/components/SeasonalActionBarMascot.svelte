<script lang="ts">
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import GhostMascot from "./_internal/mascots/GhostMascot.svelte";
  import PartyHatMascot from "./_internal/mascots/PartyHatMascot.svelte";
  import SantaHatMascot from "./_internal/mascots/SantaHatMascot.svelte";
  import SnowCap from "./_internal/mascots/SnowCap.svelte";

  const { activeTheme } = useSeasonalTheme();
</script>

{#if $activeTheme === "christmas"}
  <div data-seasonal-decoration class="trakt-seasonal-snow-cap">
    <SnowCap />
  </div>
{/if}

{#if $activeTheme}
  <div
    data-seasonal-decoration
    class="trakt-seasonal-mascot"
    data-season={$activeTheme}
  >
    {#if $activeTheme === "halloween"}
      <GhostMascot />
    {/if}

    {#if $activeTheme === "christmas"}
      <SantaHatMascot />
    {/if}

    {#if $activeTheme === "new-year"}
      <PartyHatMascot />
    {/if}
  </div>
{/if}

<style>
  .trakt-seasonal-mascot {
    --mascot-size: var(--ni-40);

    position: absolute;
    width: var(--mascot-size);
    height: var(--mascot-size);

    pointer-events: none;

    &[data-season="halloween"] {
      z-index: var(--layer-background);

      top: calc(-0.7 * var(--mascot-size));
      inset-inline-end: calc(0.4 * var(--mascot-size));
    }

    &[data-season="christmas"] {
      z-index: var(--layer-base);

      top: calc(-0.55 * var(--mascot-size));
      inset-inline-end: calc(-0.35 * var(--mascot-size));

      transform: rotate(calc(var(--rtl-sign) * 15deg));
    }

    &[data-season="new-year"] {
      --mascot-size: var(--ni-36);

      z-index: var(--layer-base);

      top: calc(-0.8 * var(--mascot-size));
      inset-inline-end: calc(-0.15 * var(--mascot-size));

      transform: rotate(calc(var(--rtl-sign) * 18deg));
    }
  }

  .trakt-seasonal-snow-cap {
    position: absolute;
    z-index: var(--layer-base);

    inset: 0;
    border-radius: inherit;

    pointer-events: none;
  }
</style>
