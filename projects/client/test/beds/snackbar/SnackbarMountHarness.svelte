<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";

  // Mirrors how ActionToastHost mounts the Snackbar: a parent `{#if}` block
  // controls its presence while `open` stays true. Toggling `show` after the
  // initial render is what a local transition would ignore and a global one
  // would play.
  const { show }: { show: boolean } = $props();
</script>

{#if show}
  <Snackbar open onDismiss={() => {}} message="Test toast" />
{/if}
