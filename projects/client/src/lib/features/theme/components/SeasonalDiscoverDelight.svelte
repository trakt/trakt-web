<script lang="ts">
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import PartyPoppers from "./_internal/discover/PartyPoppers.svelte";
  import PeekingGhost from "./_internal/discover/PeekingGhost.svelte";
  import SantaSleigh from "./_internal/christmas/SantaSleigh.svelte";

  const { activeTheme } = useSeasonalTheme();
  const { hasSeasonalDecor } = useDiscover();
  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);
</script>

{#if $hasSeasonalDecor && !$isReducedMotion}
  {#if $activeTheme === "halloween"}
    <PeekingGhost />
  {/if}

  {#if $activeTheme === "christmas"}
    <SantaSleigh />
  {/if}

  {#if $activeTheme === "new-year"}
    <PartyPoppers />
  {/if}
{/if}
