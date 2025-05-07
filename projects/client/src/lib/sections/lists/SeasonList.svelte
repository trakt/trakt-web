<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { Season } from "$lib/requests/models/Season";
  import SeasonEpisodeList from "./SeasonEpisodeList.svelte";
  import SeasonPosterList from "./SeasonPosterList.svelte";
  import { useSeasonEpisodes } from "./stores/useSeasonEpisodes";

  type SeasonListProps = {
    show: MediaEntry;
    seasons: Season[];
    currentSeason: number;
  };

  const { show, seasons, currentSeason }: SeasonListProps = $props();

  const { list: episodes } = $derived(
    useSeasonEpisodes(show.slug, currentSeason),
  );

  const title = m.seasons_label();
  const subtitle = $derived(m.season_number_label({ number: currentSeason }));

  const episodeProps = $derived(
    seasons.length === 1 ? { title, subtitle } : {},
  );
</script>

{#if seasons.length > 1}
  <SeasonPosterList
    {currentSeason}
    {show}
    {seasons}
    episodes={$episodes}
    {title}
    {subtitle}
  />
{/if}
<SeasonEpisodeList {show} episodes={$episodes} {...episodeProps} />
