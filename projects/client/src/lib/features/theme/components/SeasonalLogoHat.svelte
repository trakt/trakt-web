<script lang="ts">
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import PartyHatMascot from "./_internal/mascots/PartyHatMascot.svelte";
  import SantaHatMascot from "./_internal/mascots/SantaHatMascot.svelte";
  import WitchHatMascot from "./_internal/mascots/WitchHatMascot.svelte";

  const { activeTheme } = useSeasonalTheme();
</script>

{#if $activeTheme}
  <div class="trakt-seasonal-logo-hat" data-season={$activeTheme}>
    {#if $activeTheme === "halloween"}
      <WitchHatMascot />
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
  .trakt-seasonal-logo-hat {
    --hat-size: var(--ni-24);

    position: absolute;
    top: calc(-0.55 * var(--hat-size));
    inset-inline-end: calc(-0.2 * var(--hat-size));

    width: var(--hat-size);
    height: var(--hat-size);

    pointer-events: none;
    transform: rotate(calc(var(--rtl-sign) * 18deg));

    &[data-season="halloween"] {
      --hat-size: var(--ni-28);
    }

    &[data-season="new-year"] {
      --hat-size: var(--ni-20);

      top: calc(-0.75 * var(--hat-size));
    }
  }
</style>
