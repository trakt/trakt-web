<script lang="ts">
  import type { TierAuraTier } from "../TierAuraTier.ts";
  import DirectorAura from "./DirectorAura.svelte";
  import EliteAura from "./EliteAura.svelte";
  import LegendAura from "./LegendAura.svelte";
  import RingAura from "./RingAura.svelte";
  import VeteranAura from "./VeteranAura.svelte";

  const { tier }: { tier: TierAuraTier } = $props();
</script>

{#if tier === "veteran"}
  <VeteranAura />
{:else if tier === "elite"}
  <EliteAura />
{:else if tier === "legend"}
  <LegendAura />
{:else if tier === "director"}
  <DirectorAura />
{:else}
  <RingAura {tier} />
{/if}
