<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import SeasonEpisodesTab from "$lib/sections/summary/components/seasons/SeasonEpisodesTab.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import EpisodeInfoTab from "./_internal/EpisodeInfoTab.svelte";
  import EpisodeReviewsTab from "./_internal/EpisodeReviewsTab.svelte";
  import { useEpisodeSummary } from "./_internal/useEpisodeSummary.ts";

  const {
    onClose,
    show,
    seasons,
    season,
    episode,
  }: {
    show: ShowEntry;
    seasons: Season[];
    season: number;
    episode: number;
    onClose: () => void;
  } = $props();

  let isOpen = $state(false);
  let activeTab = $state("info");

  const params$ = fromRune(() => ({
    slug: show.slug,
    season,
    episode,
  }));

  const { episode: episodeEntry, isLoading } = useEpisodeSummary(params$);

  onMount(() => {
    // The card that opened the drawer keeps focus during the URL
    // navigation (data-sveltekit-keepfocus), so activeElement at mount
    // is the originating trigger - return focus to it on close.
    const trigger = document.activeElement;

    return () => {
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus();
      }
    };
  });
</script>

{#snippet infoIcon()}
  <InfoIcon />
{/snippet}

{#snippet reviewsIcon()}
  <CommentIcon />
{/snippet}

{#snippet episodesIcon()}
  <PlayIcon />
{/snippet}

{#snippet infoContent()}
  {#if $episodeEntry}
    <EpisodeInfoTab {show} episode={$episodeEntry} />
  {:else if $isLoading}
    <LoadingIndicator />
  {/if}
{/snippet}

{#snippet reviewsContent()}
  {#if $episodeEntry}
    <EpisodeReviewsTab {show} episode={$episodeEntry} />
  {:else if $isLoading}
    <LoadingIndicator />
  {/if}
{/snippet}

{#snippet episodesContent()}
  <SeasonEpisodesTab
    {show}
    {seasons}
    currentSeason={season}
    currentEpisode={episode}
  />
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={m.drawer_title_episode_information()}
  size="large"
>
  {#if isOpen}
    <div class="episode-drawer-content" transition:fade={{ duration: 150 }}>
      <TabView
        value={activeTab}
        onChange={(value) => (activeTab = value)}
        tabs={[
          {
            value: "info",
            label: m.tab_text_seasons_info(),
            icon: infoIcon,
            content: infoContent,
          },
          {
            value: "reviews",
            label: m.tab_text_seasons_reviews(),
            icon: reviewsIcon,
            content: reviewsContent,
          },
          {
            value: "episodes",
            label: m.tab_text_seasons_episodes(),
            icon: episodesIcon,
            content: episodesContent,
          },
        ]}
      />
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .episode-drawer-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    padding-bottom: var(--ni-8);

    :global(.trakt-list-item-container) {
      padding-inline: 0;
    }

    :global(.trakt-grid-list-container) {
      overflow-x: visible;
    }
  }
</style>
