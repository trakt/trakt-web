<script lang="ts">
  import type { SeasonalThemeId } from "$lib/features/theme/models/SeasonalThemeId";
  import PartyHatMascot from "./PartyHatMascot.svelte";
  import SantaHatMascot from "./SantaHatMascot.svelte";
  import WitchHatMascot from "./WitchHatMascot.svelte";

  const { themeId }: { themeId: SeasonalThemeId } = $props();
</script>

{#if themeId === "halloween"}
  <WitchHatMascot />
{/if}

{#if themeId === "christmas"}
  <SantaHatMascot />
{/if}

{#if themeId === "new-year"}
  <PartyHatMascot />
{/if}
