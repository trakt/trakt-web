<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { useStoredFilters } from "./useStoredFilters";

  const { children }: ChildrenProps = $props();

  const { restoreFilters } = useStoredFilters();

  afterNavigate(() => {
    restoreFilters();
  });
</script>

{@render children()}
