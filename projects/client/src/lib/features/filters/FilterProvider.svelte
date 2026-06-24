<script lang="ts">
  import { onMount } from "svelte";
  import { useStoredFilters } from "./useStoredFilters";

  const { children }: ChildrenProps = $props();

  const { restoreFilters } = useStoredFilters();

  onMount(() => {
    restoreFilters();
  });
</script>

{@render children()}
