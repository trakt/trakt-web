<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import SeasonEpisodeItem from "$lib/sections/lists/season/_internal/SeasonEpisodeItem.svelte";
  import { useShowWatchedEpisodes } from "$lib/sections/lists/season/_internal/useShowWatchedEpisodes";
  import { useSeasonEpisodes } from "$lib/sections/lists/stores/useSeasonEpisodes";
  import SeasonProgressCard from "$lib/sections/summary/components/seasons/SeasonProgressCard.svelte";
  import { summaryDrawerNavigation } from "$lib/sections/summary/_internal/summaryDrawerNavigation";
  import { countWatchedEpisodes } from "$lib/utils/media/countWatchedEpisodes";
  import DrawerTabTitle from "$lib/sections/summary/components/_internal/DrawerTabTitle.svelte";

  const {
    show,
    seasons,
    currentSeason,
    currentEpisode,
  }: {
    show: ShowEntry;
    seasons: Season[];
    currentSeason: number;
    currentEpisode?: number;
  } = $props();

  const { buildEpisodeDrawerLink } = summaryDrawerNavigation();

  const { list: episodes, isLoading } = $derived(
    useSeasonEpisodes(show.slug, currentSeason),
  );

  const { watchedBySeason, isLoading: isWatchedLoading } = $derived(
    useShowWatchedEpisodes({ showId: show.id }),
  );

  const { history } = useUser();

  const showProgress = $derived($history?.shows.get(show.id));
  const watchedEpisodeCount = $derived(
    countWatchedEpisodes(showProgress?.playsPerSeason ?? new Map()),
  );
  const hasUnseenEpisodes = $derived(watchedEpisodeCount < show.episode.count);

  const previousSeasons = $derived(
    seasons.filter((s) => s.number > 0 && s.number < currentSeason),
  );

  const currentSeasonData = $derived(
    seasons.find((s) => s.number === currentSeason),
  );
  const currentSeasonWatched = $derived(
    $watchedBySeason?.get(currentSeason)?.size ?? 0,
  );
</script>

<div class="season-episodes-tab">
  <RenderFor audience="authenticated">
    {#if currentSeasonData && currentSeasonData.episodes.count > 0}
      <SeasonProgressCard
        seasonNumber={currentSeason}
        watched={currentSeasonWatched}
        total={currentSeasonData.episodes.count}
        totalRuntime={currentSeasonData.totalRuntime}
        loading={$isWatchedLoading}
      />
    {/if}
  </RenderFor>

  <DrawerTabTitle title={m.tab_text_seasons_episodes()}>
    {#snippet metaInfo()}
      {#if !$isLoading}
        <ListMetaInfo
          text={m.tag_text_number_of_episodes({ count: $episodes.length })}
        />
      {/if}
    {/snippet}
  </DrawerTabTitle>

  {#if $isLoading}
    <LoadingIndicator />
  {:else}
    <GridList
      id={`season-episodes-${show.slug}-${currentSeason}`}
      items={$episodes}
      --width-item="var(--width-summary-card)"
    >
      {#snippet item(episode)}
        <SeasonEpisodeItem
          {show}
          {episode}
          {previousSeasons}
          {hasUnseenEpisodes}
          currentSeasonEpisodes={$episodes}
          watchedBySeason={$watchedBySeason}
          isWatchedLoading={$isWatchedLoading}
          isCurrentEpisode={episode.number === currentEpisode}
          urlOverride={buildEpisodeDrawerLink({
            season: episode.season,
            episode: episode.number,
          })}
          style="minimal"
          source="seasons-drawer"
        />
      {/snippet}
    </GridList>
  {/if}
</div>

<style lang="scss">
  .season-episodes-tab {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    :global(.trakt-season-episode-item) {
      min-width: 0;
    }

    :global(.trakt-list-items) {
      grid-template-columns: 1fr;
      grid-row-gap: var(--gap-s);
    }

    :global(.trakt-summary-card-minimal) {
      --poster-aspect-ratio: 1.778;
    }
  }
</style>
