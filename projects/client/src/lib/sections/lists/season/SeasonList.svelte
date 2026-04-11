<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useSeasonEpisodes } from "$lib/sections/lists/stores/useSeasonEpisodes";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import SeasonDropdown from "./_internal/SeasonDropdown.svelte";
  import SeasonEpisodeList from "./_internal/SeasonEpisodeList.svelte";
  import SeasonPosterList from "./_internal/SeasonPosterList.svelte";

  type SeasonListProps = {
    show: ShowEntry;
    seasons: Season[];
    currentSeason: number;
  };

  const { show, seasons, currentSeason }: SeasonListProps = $props();

  const { list: episodes } = $derived(
    useSeasonEpisodes(show.slug, currentSeason),
  );

  const title = m.list_title_seasons();
  const subtitle = $derived(seasonLabel(currentSeason));
  const hasSingleSeason = $derived(seasons.length === 1);

  const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isLargeScreen = $derived($isTabletLarge || $isDesktop);

  const previousSeasons = $derived(
    seasons.filter((s) => s.number > 0 && s.number < currentSeason),
  );

  const episodeProps = $derived.by(() => {
    if (hasSingleSeason) return { title, subtitle };
    return isLargeScreen ? { title } : {};
  });
</script>

<RenderFor audience="all" device={["mobile", "tablet-sm"]}>
  {#if seasons.length > 1}
    <SeasonPosterList
      {show}
      {seasons}
      episodes={$episodes}
      {title}
      {subtitle}
      {currentSeason}
    />
  {/if}
</RenderFor>

{#snippet headerActions()}
  <SeasonDropdown showSlug={show.slug} {seasons} {currentSeason} />
{/snippet}

<SeasonEpisodeList
  {show}
  {previousSeasons}
  episodes={$episodes}
  headerActions={isLargeScreen && !hasSingleSeason ? headerActions : undefined}
  {...episodeProps}
/>
