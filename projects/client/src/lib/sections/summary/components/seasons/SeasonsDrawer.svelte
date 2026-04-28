<script lang="ts">
  import { page } from "$app/state";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import SeasonItem from "$lib/sections/lists/components/SeasonItem.svelte";
  import SeasonEpisodeItem from "$lib/sections/lists/season/_internal/SeasonEpisodeItem.svelte";
  import SeasonPopupMenu from "$lib/sections/lists/season/_internal/SeasonPopupMenu.svelte";
  import { useShowWatchedEpisodes } from "$lib/sections/lists/season/_internal/useShowWatchedEpisodes";
  import { useSeasonEpisodes } from "$lib/sections/lists/stores/useSeasonEpisodes";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import { countWatchedEpisodes } from "$lib/utils/media/countWatchedEpisodes";
  import { fade } from "svelte/transition";

  const {
    onClose,
    show,
    seasons,
    currentSeason,
  }: {
    show: ShowEntry;
    seasons: Season[];
    currentSeason: number;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);

  const { list: episodes, isLoading } = $derived(
    useSeasonEpisodes(show.slug, currentSeason),
  );

  const { history } = useUser();

  const showProgress = $derived($history?.shows.get(show.id));
  const watchedEpisodeCount = $derived(
    countWatchedEpisodes(showProgress?.playsPerSeason ?? new Map()),
  );
  const hasUnseenEpisodes = $derived(watchedEpisodeCount < show.episode.count);

  const { watchedBySeason, isLoading: isWatchedLoading } = $derived(
    useShowWatchedEpisodes({ showId: show.id }),
  );

  const previousSeasons = $derived(
    seasons.filter((s) => s.number > 0 && s.number < currentSeason),
  );

  const seasonPosterUrl = $derived(
    seasons.find((s) => s.number === currentSeason)?.poster?.url.thumb,
  );

  const buildSeasonLink = (seasonNumber: number) => {
    const url = new URL(page.url);
    url.searchParams.set("season", String(seasonNumber));
    return url.toString();
  };
</script>

{#snippet badge()}
  <SeasonPopupMenu
    title={seasonLabel(currentSeason)}
    episodes={$episodes}
    {show}
    disabled={$isLoading}
  />
{/snippet}

<Drawer
  {onClose}
  {badge}
  onOpened={() => (isOpen = true)}
  title={m.list_title_seasons()}
  size="large"
  metaInfo={seasonLabel(currentSeason)}
>
  {#if isOpen}
    <div class="seasons-drawer-content" transition:fade={{ duration: 150 }}>
      {#if seasons.length > 1}
        <div class="seasons-section">
          <GridList
            id={`seasons-list-${show.slug}`}
            items={seasons}
            --width-item="var(--width-portrait-card)"
          >
            {#snippet item(season)}
              <SeasonItem
                media={show}
                {season}
                isCurrentSeason={season.number === currentSeason}
                urlBuilder={() => buildSeasonLink(season.number)}
              />
            {/snippet}
          </GridList>
        </div>
      {/if}

      <div class="episodes-section">
        {#snippet metaInfo()}
          <p class="secondary">
            {m.tag_text_number_of_episodes({ count: $episodes.length })}
          </p>
        {/snippet}

        {#if $isLoading}
          <LoadingIndicator />
        {:else}
          <GridList
            id={`season-episodes-${show.slug}-${currentSeason}`}
            title={m.list_title_episodes()}
            items={$episodes}
            {metaInfo}
            --width-item="var(--width-summary-card)"
          >
            {#snippet item(episode)}
              <SeasonEpisodeItem
                {show}
                {episode}
                {previousSeasons}
                {hasUnseenEpisodes}
                watchedBySeason={$watchedBySeason}
                isWatchedLoading={$isWatchedLoading}
                coverUrl={seasonPosterUrl}
                style="compact"
                source="seasons-drawer"
              />
            {/snippet}
          </GridList>
        {/if}
      </div>
    </div>
  {/if}
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .seasons-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);

    :global(.trakt-list-item-container) {
      padding: 0;
    }
  }

  .seasons-section {
    --column-count: 4;

    --container-width: calc(
      var(--drawer-size) - 2 * var(--drawer-padding) - var(--list-gap) * 2
    );
    --width-override-card: calc(
      (var(--container-width) - (var(--column-count) - 1) * var(--list-gap)) /
        var(--column-count)
    );
    --height-override-card-cover: calc(var(--width-override-card) * 1.5);
    --height-override-card: calc(
      var(--height-override-card-cover) + var(--height-card-footer-sm)
    );

    @include for-mobile {
      --container-width: calc(100dvw - 2 * var(--drawer-padding));
    }

    :global(.trakt-list-items) {
      grid-row-gap: var(--gap-s);
      grid-template-columns: repeat(var(--column-count), 1fr);
    }
  }

  .episodes-section {
    :global(.trakt-list-items) {
      grid-template-columns: 1fr;
      grid-row-gap: var(--gap-s);
    }

    :global(.trakt-list-inset-title) {
      margin: 0;
    }
  }
</style>
