<script lang="ts">
  import { page } from "$app/state";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import HalloweenToggle from "./_internal/HalloweenToggle.svelte";

  const { activeTheme } = useSeasonalTheme();
  const { useSeasonalFilters, setSeasonalFilters } = useDiscover();

  const isOnDiscoverPage = $derived(page.route.id === UrlBuilder.discover());

  const { track } = useTrack(AnalyticsEvent.SeasonalFilter);
</script>

{#if isOnDiscoverPage}
  {#if $activeTheme === "halloween"}
    <HalloweenToggle
      isEnabled={$useSeasonalFilters}
      onToggle={() => {
        const state = !$useSeasonalFilters;

        track({
          id: $activeTheme,
          state: state ? "enabled" : "disabled",
        });

        setSeasonalFilters(state);
      }}
    />
  {/if}
{/if}
