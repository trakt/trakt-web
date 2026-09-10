<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { m } from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import { SummaryDrawers } from "$lib/sections/summary/SummaryDrawers.ts";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import { useLandscapeListItemCount } from "$lib/sections/lists/stores/useLandscapeListItemCount";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { countWatchedEpisodes } from "$lib/utils/media/countWatchedEpisodes";
  import type { Snippet } from "svelte";
  import EpisodeRailEdgeBadge from "./EpisodeRailEdgeBadge.svelte";
  import { getEpisodeWindow } from "./getEpisodeWindow.ts";
  import SeasonEpisodeItem from "./SeasonEpisodeItem.svelte";
  import { useShowWatchedEpisodes } from "./useShowWatchedEpisodes";

  type SeasonEpisodeListProps = {
    show: ShowEntry;
    previousSeasons: Season[];
    episodes: EpisodeEntry[];
    title?: string;
    headerActions?: Snippet;
    subtitle?: string;
    currentEpisode?: number;
  };

  const {
    show,
    previousSeasons,
    episodes,
    title,
    subtitle,
    headerActions,
    currentEpisode,
  }: SeasonEpisodeListProps = $props();

  const { history } = useUser();

  const showProgress = $derived($history?.shows.get(show.id));
  const watchedEpisodeCount = $derived(
    countWatchedEpisodes(showProgress?.playsPerSeason ?? new Map()),
  );
  const hasUnseenEpisodes = $derived(watchedEpisodeCount < show.episode.count);

  const { watchedBySeason, isLoading: isWatchedLoading } = $derived(
    useShowWatchedEpisodes({ showId: show.id }),
  );

  const { buildDrawerLink, buildEpisodeDrawerLink } = summaryDrawerNavigation();
  const seasonDrawerLink = $derived(buildDrawerLink(SummaryDrawers.Seasons));

  const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isLargeScreen = $derived($isTabletLarge || $isDesktop);

  const itemCount = useLandscapeListItemCount();

  /*
    Large screens mask the strip instead of scrolling it, so the rail shows a
    window rather than the whole season. It opens on the episode the viewer is
    up to, and the counts either side ride the first and last cards - see
    getEpisodeWindow. Small screens scroll freely, so they keep every episode
    and need no counts.
  */
  const anchorIndex = $derived(
    currentEpisode == null
      ? 0
      : episodes.findIndex((episode) => episode.number === currentEpisode),
  );

  const window = $derived(
    isLargeScreen
      ? getEpisodeWindow({
        total: episodes.length,
        slots: $itemCount,
        anchorIndex,
      })
      : { start: 0, end: episodes.length, before: 0, after: 0 },
  );

  const visibleEpisodes = $derived(episodes.slice(window.start, window.end));

  /* The rail's own ends, so the badges can find the cards they dock to -
     SectionList hands its item snippet the episode, not its position. */
  const firstVisibleNumber = $derived(visibleEpisodes.at(0)?.number);
  const lastVisibleNumber = $derived(visibleEpisodes.at(-1)?.number);
</script>

<!-- Declared out here on purpose: a snippet written inside a component is
     one of that component's props, and these belong to the cards. -->
{#snippet earlierBadge()}
  <EpisodeRailEdgeBadge
    side="start"
    count={window.before}
    link={seasonDrawerLink}
  />
{/snippet}

{#snippet laterBadge()}
  <EpisodeRailEdgeBadge side="end" count={window.after} link={seasonDrawerLink} />
{/snippet}

<SectionList
  id={{
    scope: "season-episode-list",
    key: show.slug,
  }}
  items={visibleEpisodes}
  {title}
  {subtitle}
  --height-list={mediaListHeightResolver("landscape")}
  drilldown={{
    ...seasonDrawerLink,
    source: { id: "seasons" },
    label: m.button_text_view_all(),
  }}
>
  {#snippet item(episode)}
    {@const isRailStart = window.before > 0 &&
      episode.number === firstVisibleNumber}
    {@const isRailEnd = window.after > 0 &&
      episode.number === lastVisibleNumber}
    <SeasonEpisodeItem
      {show}
      {episode}
      {previousSeasons}
      {hasUnseenEpisodes}
      currentSeasonEpisodes={episodes}
      watchedBySeason={$watchedBySeason}
      isWatchedLoading={$isWatchedLoading}
      isCurrentEpisode={episode.number === currentEpisode}
      urlOverride={buildEpisodeDrawerLink({
        season: episode.season,
        episode: episode.number,
      })}
      source="season-episode-list"
      edge={isRailStart ? earlierBadge : isRailEnd ? laterBadge : undefined}
    />
  {/snippet}

  {#snippet actions()}
    {#if headerActions}
      {@render headerActions()}
    {/if}
  {/snippet}
</SectionList>
