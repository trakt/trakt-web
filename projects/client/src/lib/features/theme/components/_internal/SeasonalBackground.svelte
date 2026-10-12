<script lang="ts">
  import type { SeasonalThemeId } from "$lib/features/theme/models/SeasonalThemeId";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import SeasonalGlow from "./ambient/SeasonalGlow.svelte";
  import SeasonalParticles from "./ambient/SeasonalParticles.svelte";
  import SeasonalGarland from "./decor/SeasonalGarland.svelte";
  import HalloweenBats from "./halloween/HalloweenBats.svelte";
  import HalloweenCobweb from "./halloween/HalloweenCobweb.svelte";

  const { themeId }: { themeId: SeasonalThemeId } = $props();
  const { hasSeasonalDecor } = useDiscover();
  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);
</script>

{#if $hasSeasonalDecor}
  <SeasonalGlow {themeId} />

  {#if themeId === "halloween"}
    <RenderFor audience="all" device={["desktop", "tablet-lg"]}>
      <HalloweenCobweb />
    </RenderFor>
  {/if}

  {#if themeId === "christmas"}
    <SeasonalGarland variant="lights" />
  {/if}

  {#if themeId === "new-year"}
    <SeasonalGarland variant="bunting" />
  {/if}

  {#if !$isReducedMotion}
    <SeasonalParticles {themeId} />

    {#if themeId === "halloween"}
      <HalloweenBats />
    {/if}
  {/if}
{/if}
