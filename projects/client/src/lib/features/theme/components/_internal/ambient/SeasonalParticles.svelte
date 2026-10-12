<script lang="ts">
  import type { SeasonalThemeId } from "$lib/features/theme/models/SeasonalThemeId";
  import { confettiPainter } from "./painters/confettiPainter";
  import { emberPainter } from "./painters/emberPainter";
  import { fireworkPainter } from "./painters/fireworkPainter";
  import { snowPainter } from "./painters/snowPainter";
  import ParticleBackground from "./ParticleBackground.svelte";

  const {
    themeId,
    hasFireworks = false,
  }: { themeId: SeasonalThemeId; hasFireworks?: boolean } = $props();
</script>

{#if themeId === "halloween"}
  <ParticleBackground painter={emberPainter} />
{/if}

{#if themeId === "christmas"}
  <ParticleBackground painter={snowPainter} />
{/if}

{#if themeId === "new-year"}
  {#if hasFireworks}
    <ParticleBackground painter={fireworkPainter} />
  {/if}
  <ParticleBackground painter={confettiPainter} />
{/if}
