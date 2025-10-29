<script lang="ts">
  import { page } from "$app/state";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import HalloweenToggle from "./_internal/HalloweenToggle.svelte";

  const { activeTheme } = useSeasonalTheme();
  const { useSeasonalFilters, setSeasonalFilters } = useDiscover();

  const isOnDiscoverPage = $derived(page.route.id === UrlBuilder.discover());
</script>

{#if isOnDiscoverPage}
  {#if $activeTheme === "halloween"}
    <HalloweenToggle
      isEnabled={$useSeasonalFilters}
      onToggle={() => setSeasonalFilters(!$useSeasonalFilters)}
    />
  {/if}
{/if}
