<script lang="ts">
  import { confettiPainter } from "./painters/confettiPainter";
  import { emberPainter } from "./painters/emberPainter";
  import { snowPainter } from "./painters/snowPainter";
  import ParticleBackground from "./ParticleBackground.svelte";

  const { themeId }: { themeId: string } = $props();
</script>

{#if themeId === "halloween"}
  <ParticleBackground painter={emberPainter} />
{/if}

{#if themeId === "christmas"}
  <ParticleBackground painter={snowPainter} />
{/if}

{#if themeId === "new-year"}
  <ParticleBackground painter={confettiPainter} />
{/if}
