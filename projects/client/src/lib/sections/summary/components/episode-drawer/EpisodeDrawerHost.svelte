<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import DrawerCastSection from "$lib/sections/summary/components/_internal/DrawerCastSection.svelte";
  import MediaStats from "$lib/sections/summary/components/details/_internal/MediaStats.svelte";
  import MediaStatsSkeleton from "$lib/sections/summary/components/details/_internal/MediaStatsSkeleton.svelte";
  import RatingsDrawer from "$lib/sections/summary/components/rating/RatingsDrawer.svelte";
  import SeasonEpisodesTab from "$lib/sections/summary/components/seasons/SeasonEpisodesTab.svelte";
  import SocialDrawerHost from "$lib/sections/summary/components/social/SocialDrawerHost.svelte";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import EpisodeInfoHeader from "./_internal/EpisodeInfoHeader.svelte";
  import EpisodeReviewsTab from "./_internal/EpisodeReviewsTab.svelte";
  import EpisodeReviewsTabSkeleton from "./_internal/EpisodeReviewsTabSkeleton.svelte";
  import { useEpisodePeople } from "./_internal/useEpisodePeople.ts";
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

  // Ratings distribution and social activities open as drawers stacked on top
  // of this one, mounted locally (not via the `view=` URL param, which would
  // replace this drawer and resolve show-scoped data instead of the episode).
  const isRatingsOpen = writable(false);
  const isSocialOpen = writable(false);

  const socialTarget = $derived({
    type: "episode" as const,
    slug: show.slug,
    season,
    episode,
  });

  const params$ = fromRune(() => ({
    slug: show.slug,
    season,
    episode,
  }));

  const { episode: episodeEntry, isLoading } = useEpisodeSummary(params$);
  const { crew, isLoading: isPeopleLoading } = useEpisodePeople(params$);

  // Reset the drawer scroll to the top. Attached to a {#key} anchor so it
  // runs once per episode (the keyed block remounts on change). Deferred a
  // frame so the new content has rendered and any focus-driven scroll from
  // the navigation has settled.
  const scrollToTop = (node: HTMLElement) => {
    const scroller = node.closest(".trakt-drawer-content");
    if (!scroller) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      scroller.scrollTo({ top: 0, behavior: "smooth" });
    });

    return () => cancelAnimationFrame(frame);
  };

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

  const episodeTitle = $derived.by(() => {
    const numberLabel = episodeNumberLabel({
      seasonNumber: season,
      episodeNumber: episode,
    });

    return $episodeEntry
      ? `${numberLabel} - ${$episodeEntry.title}`
      : numberLabel;
  });

  const socialTitle = $derived(
    $episodeEntry ? episodeActivityTitle($episodeEntry, show) : show.title,
  );
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
  <div class="episode-info-content">
    {#if $episodeEntry}
      <MediaStats type="episode" episode={$episodeEntry} {show} crew={$crew} />
    {:else}
      <MediaStatsSkeleton />
    {/if}

    <DrawerCastSection
      crew={$crew}
      type="episode"
      isLoading={$isPeopleLoading}
    />
  </div>
{/snippet}

{#snippet reviewsContent()}
  {#if $episodeEntry}
    <EpisodeReviewsTab {show} episode={$episodeEntry} />
  {:else if $isLoading}
    <EpisodeReviewsTabSkeleton />
  {/if}
{/snippet}

{#snippet episodesContent()}
  <SeasonEpisodesTab
    {show}
    {seasons}
    currentSeason={season}
    currentEpisode={episode}
    showSeasonSelector
  />
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  // title={m.drawer_title_episode_information()}
  title={show.title}
  metaInfo={episodeTitle}
  size="large"
  classList="trakt-episode-drawer"
>
  {#if isOpen}
    <div class="episode-drawer-content" transition:fade={{ duration: 150 }}>
      {#key `${season}-${episode}`}
        <div class="episode-scroll-anchor" {@attach scrollToTop}></div>
      {/key}

      <EpisodeInfoHeader
        {show}
        {seasons}
        {season}
        {episode}
        entry={$episodeEntry}
        crew={$crew}
        isCrewLoading={$isPeopleLoading}
        {socialTarget}
        {socialTitle}
        onRatingsOpen={() => isRatingsOpen.set(true)}
        onSocialOpen={() => isSocialOpen.set(true)}
      />

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

{#if $isRatingsOpen && $episodeEntry}
  <RatingsDrawer
    type="episode"
    episode={$episodeEntry}
    {show}
    crew={$crew}
    {seasons}
    elevated
    onClose={() => isRatingsOpen.set(false)}
  />
{/if}

{#if $isSocialOpen}
  <SocialDrawerHost
    target={socialTarget}
    title={socialTitle}
    elevated
    onClose={() => isSocialOpen.set(false)}
  />
{/if}

<style lang="scss">
  :global(.trakt-drawer.trakt-episode-drawer) {
    gap: var(--ni-0);
  }

  .episode-scroll-anchor {
    display: contents;
  }

  .episode-info-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }

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
