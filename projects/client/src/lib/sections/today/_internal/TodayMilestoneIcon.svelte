<script lang="ts">
  import FinaleIcon from "$lib/components/icons/FinaleIcon.svelte";
  import PremiereIcon from "$lib/components/icons/PremiereIcon.svelte";
  import type { TodayMilestone } from "../models/TodayMilestone.ts";

  const { milestone }: { milestone: TodayMilestone } = $props();

  const isFinale = $derived(
    milestone.type === "season-end" || milestone.type === "series-end",
  );
</script>

{#if isFinale}
  <FinaleIcon />
{:else}
  <PremiereIcon />
{/if}
