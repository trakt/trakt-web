<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage";
  import { firstValueFrom } from "rxjs";
  import { onMount } from "svelte";
  import {
    DISCOVER_MODE_PARAM,
    SEASONAL_STORAGE_KEY,
  } from "./_internal/constants";
  import { createDiscoverContext } from "./_internal/createDiscoverContext";

  const { children }: ChildrenProps = $props();

  const useSeasonalFilters = JSON.parse(
    safeLocalStorage.getItem(SEASONAL_STORAGE_KEY) ?? "true",
  );

  createDiscoverContext(useSeasonalFilters);

  onMount(async () => {
    if (page.url.searchParams.has(DISCOVER_MODE_PARAM)) return;

    // If there is no search param, use the default or value from local storage
    const { current } = useToggler("discover");
    const { value: initialMode } = await firstValueFrom(current);

    const url = new URL(page.url.href);
    url.searchParams.set(DISCOVER_MODE_PARAM, initialMode);
    goto(url, { replaceState: true, keepFocus: true, noScroll: true });
  });
</script>

{@render children()}
