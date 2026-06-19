<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useAllPagesInfiniteQuery } from "$lib/features/query/useQuery.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { showActivityHistoryQuery } from "$lib/requests/queries/users/showActivityHistoryQuery.ts";
  import { map } from "rxjs";
  import { fade } from "svelte/transition";
  import RewatchingEpisodeItem from "./_internal/RewatchingEpisodeItem.svelte";

  type RewatchingDrawerProps = {
    show: ShowEntry;
    onClose: () => void;
  };

  const { show, onClose }: RewatchingDrawerProps = $props();

  let isOpen = $state(false);
  let isActionPending = $state(false);

  const query = $derived(
    useAllPagesInfiniteQuery(
      showActivityHistoryQuery({ slug: "me", id: show.id, limit: 100 }),
    ),
  );

  const watchedEpisodes = $derived(
    query.pipe(
      map(($query) => {
        const entries =
          $query.data?.pages.flatMap((page) => page.entries) ?? [];
        const episodes = entries
          .map((entry) => entry.episode)
          .filter((episode, index, allEpisodes) =>
            episode.season !== 0 &&
            allEpisodes.findIndex((candidate) => candidate.id === episode.id) ===
              index
          );

        return episodes.toSorted((episodeA, episodeB) => {
          const seasonDiff = episodeA.season - episodeB.season;
          return seasonDiff === 0
            ? episodeA.number - episodeB.number
            : seasonDiff;
        });
      }),
    ),
  );

  const isLoading = $derived(
    query.pipe(
      map(($query) => $query.isPending || $query.isFetching),
    ),
  );

  const isDrawerLoading = $derived($isLoading || isActionPending);

  const drawerTitle = $derived(`${m.drawer_title_rewatching()} ${show.title}`);
</script>

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={drawerTitle}
  metaInfo={m.text_rewatching_next_episode_prompt()}
  size="large"
>
  {#if isOpen}
    <div
      class="rewatching-drawer-content"
      aria-busy={isDrawerLoading}
      transition:fade={{ duration: 150 }}
    >
      {#snippet empty()}
        <p class="secondary">
          {m.text_rewatching_no_episodes()}
        </p>
      {/snippet}

      {#if isDrawerLoading}
        <LoadingIndicator />
      {:else}
        <GridList
          id={`rewatching-episodes-${show.slug}`}
          items={$watchedEpisodes}
          {empty}
          --width-item="var(--width-summary-card)"
        >
          {#snippet item(episode: EpisodeEntry)}
            <RewatchingEpisodeItem
              {episode}
              {show}
              onAction={onClose}
              onPendingChange={(isPending) => (isActionPending = isPending)}
            />
          {/snippet}
        </GridList>
      {/if}
    </div>
  {/if}
</Drawer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .rewatching-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding-bottom: var(--ni-8);

    :global(.trakt-list-item-container) {
      padding: 0;
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
