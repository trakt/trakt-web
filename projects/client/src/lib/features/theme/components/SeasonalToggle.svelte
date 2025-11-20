<script lang="ts">
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { useDiscover } from "$lib/features/discover/useDiscover";
  import { useSeasonalTheme } from "../useSeasonalTheme";
  import ChristmasToggle from "./_internal/christmas/ChristmasToggle.svelte";
  import HalloweenToggle from "./_internal/halloween/HalloweenToggle.svelte";

  const { activeTheme } = useSeasonalTheme();
  const { useSeasonalFilters, setSeasonalFilters } = useDiscover();

  const { track } = useTrack(AnalyticsEvent.SeasonalFilter);

  const handler = (id: string) => {
    const state = !$useSeasonalFilters;

    track({
      id,
      state: state ? "enabled" : "disabled",
    });

    setSeasonalFilters(state);
  };
</script>

{#if $activeTheme === "halloween"}
  <HalloweenToggle
    isEnabled={$useSeasonalFilters}
    onToggle={() => handler($activeTheme)}
  />
{/if}

{#if $activeTheme === "christmas"}
  <ChristmasToggle
    isEnabled={$useSeasonalFilters}
    onToggle={() => handler($activeTheme)}
  />
{/if}
