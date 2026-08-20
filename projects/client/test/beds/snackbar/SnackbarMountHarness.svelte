<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";

  const { show }: { show: boolean } = $props();
</script>

{#if show}
  <Snackbar open onDismiss={() => {}} message="Test toast" />
{/if}
