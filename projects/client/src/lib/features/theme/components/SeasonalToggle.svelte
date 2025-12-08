<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import HalloweenToggle from "./_internal/halloween/HalloweenToggle.svelte";

  const { activeTheme } = useSeasonalTheme();
  const { useSeasonalFilters, setSeasonalFilters } = useDiscover();

  const { track } = useTrack(AnalyticsEvent.SeasonalFilter);
</script>

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
