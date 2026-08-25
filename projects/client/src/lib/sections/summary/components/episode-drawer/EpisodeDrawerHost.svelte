<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import TabView from "$lib/components/tabs/TabView.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { useMediaSpoiler } from "$lib/features/spoilers/useMediaSpoiler.ts";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import WhereToWatchList from "$lib/sections/lists/where-to-watch/WhereToWatchList.svelte";
  import WhereToWatchDrawerHost from "$lib/sections/lists/where-to-watch/WhereToWatchDrawerHost.svelte";
  import WhereToWatchListSkeleton from "$lib/sections/lists/where-to-watch/WhereToWatchListSkeleton.svelte";
  import DrawerCastSection from "$lib/sections/summary/components/_internal/DrawerCastSection.svelte";
  import MediaStats from "$lib/sections/summary/components/details/_internal/MediaStats.svelte";
  import MediaStatsSkeleton from "$lib/sections/summary/components/details/_internal/MediaStatsSkeleton.svelte";
  import HistoryDrawerHost from "$lib/sections/summary/components/history/HistoryDrawerHost.svelte";
  import RatingsDrawer from "$lib/sections/summary/components/rating/RatingsDrawer.svelte";
  import SeasonEpisodesTab from "$lib/sections/summary/components/seasons/SeasonEpisodesTab.svelte";
  import SocialDrawerHost from "$lib/sections/summary/components/social/SocialDrawerHost.svelte";
  import { trackTextOverflow } from "$lib/utils/actions/trackTextOverflow.ts";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import EpisodeInfoHeader from "./_internal/EpisodeInfoHeader.svelte";
  import EpisodeReviewsTab from "./_internal/EpisodeReviewsTab.svelte";
  import EpisodeReviewsTabSkeleton from "./_internal/EpisodeReviewsTabSkeleton.svelte";
  import { useEpisodeAired } from "./_internal/useEpisodeAired.ts";
  import { useEpisodePeople } from "./_internal/useEpisodePeople.ts";
  import { useEpisodeStreamOn } from "./_internal/useEpisodeStreamOn.ts";
  import { useEpisodeSummary } from "./_internal/useEpisodeSummary.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { of } from "rxjs";
  import { showSummaryQuery } from "$lib/requests/queries/shows/showSummaryQuery.ts";
  import { filter, map } from "rxjs/operators";

  const {
    onClose,
    slug,
    show,
    seasons,
    variant = "default",
    season,
    episode,
  }: {
    slug: string;
    show?: ShowEntry;
    seasons?: Season[];
    variant?: "default" | "glance";
    season: number;
    episode: number;
    onClose: () => void;
  } = $props();

  const isDefined = (value: string | null): value is string =>
    value != null;

  const showQuery = useQuery(
    fromRune(() => (show ? null : slug)).pipe(
      filter(isDefined),
      map(($slug) => showSummaryQuery({ slug: $slug })),
    ),
  );

  const resolvedShow = $derived(show ?? $showQuery?.data);

  const isGlance = $derived(variant === "glance");
  const episodeHref = $derived(
    UrlBuilder.episodeDrawer(slug, season, episode),
  );

  let isOpen = $state(false);
  let activeTab = $state("info");

  type StackedDrawer = "ratings" | "social" | "history" | "where-to-watch";

  const episodeKey = $derived(`${season}-${episode}`);

  let opened = $state<{ key: string; drawer: StackedDrawer }>();
  const openDrawer = $derived(
    opened?.key === episodeKey ? opened.drawer : undefined,
  );

  const openStacked = (drawer: StackedDrawer) => {
    opened = { key: episodeKey, drawer };
  };
  const closeStacked = () => {
    opened = undefined;
  };

  const socialTarget = $derived({
    type: "episode" as const,
    slug,
    season,
    episode,
  });

  const params$ = fromRune(() => ({
    slug,
    season,
    episode,
  }));

  const { episode: episodeEntry, isLoading } = useEpisodeSummary(params$);
  const { crew, isLoading: isPeopleLoading } = useEpisodePeople(params$);
  const { streamOn, isLoading: isStreamOnLoading } = useEpisodeStreamOn(
    params$,
  );
  const { isAired } = useEpisodeAired(params$);

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

  const numberLabel = $derived(
    episodeNumberLabel({ seasonNumber: season, episodeNumber: episode }),
  );

  const episodeTitle = $derived(
    $episodeEntry ? `${numberLabel} - ${$episodeEntry.title}` : numberLabel,
  );

  const isEpisodeTitleTruncated = writable(false);

  const { isSpoilerHidden } = $derived(
    resolvedShow
      ? useMediaSpoiler({
        show: resolvedShow,
        media: $episodeEntry ? [$episodeEntry] : [],
        type: "episode",
      })
      : { isSpoilerHidden: of(false) },
  );

  const socialTitle = $derived.by(() => {
    if (!resolvedShow) {
      return "";
    }

    return $episodeEntry
      ? episodeActivityTitle($episodeEntry, resolvedShow)
      : resolvedShow.title;
  });
</script>

{#snippet episodeMetaInfo()}
  <Tooltip
    content={episodeTitle}
    disabled={!$isEpisodeTitleTruncated || $isSpoilerHidden}
    side="bottom"
  >
    <p
      class="episode-title-meta-info bold ellipsis"
      use:trackTextOverflow={isEpisodeTitleTruncated}
    >
      {numberLabel}
      {#if $episodeEntry && resolvedShow}
        <Spoiler media={$episodeEntry} show={resolvedShow} type="episode">
          - {$episodeEntry.title}
        </Spoiler>
      {/if}
    </p>
  </Tooltip>
{/snippet}

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
    {#if $episodeEntry && resolvedShow}
      <MediaStats
        type="episode"
        episode={$episodeEntry}
        show={resolvedShow}
        crew={$crew}
      />
    {:else}
      <MediaStatsSkeleton />
    {/if}

    {#if $episodeEntry && resolvedShow}
      <WhereToWatchList
        type="episode"
        episode={$episodeEntry}
        media={resolvedShow}
        streamOn={$streamOn}
        isLoading={$isStreamOnLoading}
        variant="inline"
        onDrilldown={() => openStacked("where-to-watch")}
        --inset-override-list-item="0"
      />
    {:else if $isAired}
      <WhereToWatchListSkeleton
        type="episode"
        {slug}
        variant="inline"
        --inset-override-list-item="0"
      />
    {/if}

    <DrawerCastSection
      crew={$crew}
      type="episode"
      isLoading={$isPeopleLoading}
    />
  </div>
{/snippet}

{#snippet reviewsContent()}
  {#if $episodeEntry && resolvedShow}
    <EpisodeReviewsTab show={resolvedShow} episode={$episodeEntry} />
  {:else if $isLoading}
    <EpisodeReviewsTabSkeleton />
  {/if}
{/snippet}

{#snippet episodesContent()}
  {#if resolvedShow && seasons}
    <SeasonEpisodesTab
      show={resolvedShow}
      {seasons}
      currentSeason={season}
      currentEpisode={episode}
      showSeasonSelector
    />
  {/if}
{/snippet}

<Drawer
  {onClose}
  onOpened={() => (isOpen = true)}
  title={resolvedShow?.title}
  metaInfo={episodeMetaInfo}
  size="large"
  classList="trakt-episode-drawer"
>
  {#if isOpen}
    <div class="episode-drawer-content" transition:fade={{ duration: 150 }}>
      {#key `${season}-${episode}`}
        <div class="episode-scroll-anchor" {@attach scrollToTop}></div>
      {/key}

      <EpisodeInfoHeader
        {slug}
        show={resolvedShow}
        {seasons}
        hasEpisodeNavigation={!isGlance}
        titleHref={isGlance ? episodeHref : undefined}
        {season}
        {episode}
        entry={$episodeEntry}
        crew={$crew}
        isCrewLoading={$isPeopleLoading}
        {socialTarget}
        {socialTitle}
        onRatingsOpen={() => openStacked("ratings")}
        onSocialOpen={() => openStacked("social")}
        onHistoryOpen={() => openStacked("history")}
      />

      {#if !isGlance}
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
      {/if}
    </div>
  {/if}
</Drawer>

{#if openDrawer === "ratings" && $episodeEntry && resolvedShow}
  <RatingsDrawer
    type="episode"
    episode={$episodeEntry}
    show={resolvedShow}
    crew={$crew}
    seasons={seasons ?? []}
    elevated
    onClose={closeStacked}
  />
{/if}

{#if openDrawer === "social"}
  <SocialDrawerHost
    target={socialTarget}
    title={socialTitle}
    elevated
    onClose={closeStacked}
  />
{/if}

{#if openDrawer === "history" && $episodeEntry && resolvedShow}
  <HistoryDrawerHost
    type="episode"
    episode={$episodeEntry}
    show={resolvedShow}
    crew={$crew}
    elevated
    onClose={closeStacked}
  />
{/if}

{#if openDrawer === "where-to-watch" && $episodeEntry && resolvedShow}
  <WhereToWatchDrawerHost
    type="episode"
    episode={$episodeEntry}
    media={resolvedShow}
    elevated
    onClose={closeStacked}
  />
{/if}

<style lang="scss">
  :global(.trakt-drawer.trakt-episode-drawer) {
    gap: var(--ni-0);
  }

  .episode-title-meta-info {
    min-width: 0;

    color: var(--list-meta-info-color);
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
