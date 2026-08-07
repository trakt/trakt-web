<script lang="ts">
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage";
  import { firstValueFrom } from "rxjs";
  import { onMount } from "svelte";
  import { SEASONAL_STORAGE_KEY } from "./_internal/constants";
  import { createDiscoverContext } from "./_internal/createDiscoverContext";
  import { useStoredFilters } from "./useStoredFilters";

  const { children }: ChildrenProps = $props();

  const useSeasonalFilters = JSON.parse(
    safeLocalStorage.getItem(SEASONAL_STORAGE_KEY) ?? "true",
  );

  const { restoreFilters } = useStoredFilters();
  const { current, default: defaultMode } = useToggler("discover");
  createDiscoverContext(useSeasonalFilters);

  /*
    FIXME: this was merged with the DiscoverProvider. This is a quick refactor
    to fix the underlying issue. This needs to be refactored properly into a
    SearchParamProvider that can be used by both Discover, Filters, and possible
    future features that rely on search params.
  */
  onMount(async () => {
    const { value: mode } = await firstValueFrom(current);
    restoreFilters(mode === defaultMode ? undefined : mode);
  });
</script>

{@render children()}
