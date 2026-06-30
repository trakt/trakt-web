<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";

  const { progress }: { progress: number } = $props();
</script>

<DistributionBar
  fraction={progress / 100}
  color="var(--color-toast-progress-bar-progress)"
  --distribution-bar-track="var(--color-toast-progress-bar-background)"
/>
