<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useFilterSidebar } from "$lib/stores/useFilterSidebar.ts";
  import { safeLocalStorage } from "$lib/utils/storage/safeStorage.ts";
  import { onMount } from "svelte";

  const STORAGE_KEY = "discover-drilldown-filters-open";

  const { intent, open } = useFilterSidebar();
  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  onMount(() => {
    const subscription = intent.subscribe((isOpen) => {
      safeLocalStorage.setItem(STORAGE_KEY, String(isOpen));
    });

    const stored = safeLocalStorage.getItem(STORAGE_KEY);
    const isPreferredOpen = stored == null ? true : stored === "true";

    if (isPreferredOpen && !$isMobile) {
      open();
    }

    return () => subscription.unsubscribe();
  });
</script>
