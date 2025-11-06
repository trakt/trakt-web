<script lang="ts">
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage";
  import { SEASONAL_STORAGE_KEY } from "./_internal/constants";
  import { createDiscoverContext } from "./_internal/createDiscoverContext";

  const { children }: ChildrenProps = $props();

  const { current } = useToggler("discover");

  const useSeasonalFilters = JSON.parse(
    safeLocalStorage.getItem(SEASONAL_STORAGE_KEY) ?? "true",
  );

  createDiscoverContext($current.value, useSeasonalFilters);
</script>

{@render children()}
