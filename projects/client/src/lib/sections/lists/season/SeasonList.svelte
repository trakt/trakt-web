<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { useSeasonEpisodes } from "$lib/sections/lists/stores/useSeasonEpisodes";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
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

  const episodeProps = $derived(
    seasons.length === 1 ? { title, subtitle } : {},
  );

  const previousSeasons = $derived(
    seasons.filter((s) => s.number > 0 && s.number < currentSeason),
  );
</script>

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
<SeasonEpisodeList
  {show}
  {previousSeasons}
  episodes={$episodes}
  {...episodeProps}
/>
