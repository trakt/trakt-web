<script lang="ts">
  import { useStoredFilters } from "./useStoredFilters";

  const { children }: ChildrenProps = $props();

  const { restoreFilters } = useStoredFilters();
  restoreFilters();
</script>

{@render children()}
