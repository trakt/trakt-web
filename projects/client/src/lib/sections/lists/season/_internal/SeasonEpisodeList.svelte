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
  import EpisodeRailCountLabel from "./EpisodeRailCountLabel.svelte";
  import { getHiddenEpisodeCounts } from "./getHiddenEpisodeCounts.ts";
  import type { VisibleRange } from "$lib/utils/actions/VisibleRange.ts";
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

  /*
    Where the viewer is at: the furthest episode they have watched in this
    season. An explicit currentEpisode (the episode being viewed) wins.
  */
  const season = $derived(episodes.at(0)?.season);
  const contentHash = $derived(`${show.slug}-${season}`);

  const lastWatchedEpisode = $derived.by(() => {
    if (season == null) return undefined;

    const watched = $watchedBySeason.get(season);
    return watched?.size ? Math.max(...watched) : undefined;
  });
  const activeEpisode = $derived(currentEpisode ?? lastWatchedEpisode);

  const { buildDrawerLink, buildEpisodeDrawerLink, buildSeasonsDrawerLink } =
    summaryDrawerNavigation();
  const seasonDrawerLink = $derived(buildDrawerLink(SummaryDrawers.Seasons));

  const isTabletLarge = useMedia(WellKnownMediaQuery.tabletLarge);
  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const isLargeScreen = $derived($isTabletLarge || $isDesktop);

  const itemCount = useLandscapeListItemCount();

  let visibleRange = $state<VisibleRange>();

  /*
    Every episode is always rendered, so unlocking swipe scrolling never
    repaints the rail. On large screens the strip is masked rather than
    scrolled, and opens on the episode the viewer is up to - the window only
    decides where that is. Small screens just start at the beginning.
  */
  const anchorIndex = $derived(
    activeEpisode == null
      ? 0
      : Math.max(
        episodes.findIndex((episode) => episode.number === activeEpisode),
        0,
      ),
  );

  const windowStart = $derived(
    getEpisodeWindow({
      total: episodes.length,
      slots: $itemCount,
      anchorIndex,
    }).start,
  );

  /* Once the rail has left where it opened, the labels stay up in a strip
     that grows in above the stills. Keyed on the content, so a new season
     opens fresh: back on its active episode with chips docked. */
  let movedContentHash = $state<string | null>(null);
  const hasMoved = $derived(movedContentHash === contentHash);

  const initialIndex = $derived(
    isLargeScreen && !hasMoved ? windowStart : undefined,
  );

  const concealBefore = $derived(
    initialIndex == null ? 0 : (episodes.at(initialIndex)?.number ?? 0),
  );

  const hidden = $derived(
    isLargeScreen
      ? getHiddenEpisodeCounts({ total: episodes.length, range: visibleRange })
      : { before: 0, after: 0 },
  );

  /* Nothing to scroll to means nothing to float, so a swipe changes nothing. */
  const hasHidden = $derived(hidden.before + hidden.after > 0);

  /* Each label opens the drawer on the episode its own side cuts off at. */
  const earlierLink = $derived(
    buildSeasonsDrawerLink(
      visibleRange && visibleRange.first > 0
        ? episodes.at(visibleRange.first - 1)?.number
        : undefined,
    ),
  );
  const laterLink = $derived(
    buildSeasonsDrawerLink(
      visibleRange ? episodes.at(visibleRange.last + 1)?.number : undefined,
    ),
  );
</script>

{#snippet countLabels()}
  <EpisodeRailCountLabel side="start" count={hidden.before} link={earlierLink} isDocked={!hasMoved} />
  <EpisodeRailCountLabel side="end" count={hidden.after} link={laterLink} isDocked={!hasMoved} />
{/snippet}

<SectionList
  id={{
    scope: "season-episode-list",
    key: show.slug,
  }}
  items={episodes}
  onUserScroll={() => {
    if (!hasHidden) return;
    movedContentHash = contentHash;
  }}
  onVisibleRange={(range) => (visibleRange = range)}
  scrollToIndex={initialIndex}
  {contentHash}
  overlay={countLabels}
  {title}
  {subtitle}
  --list-inset-top={isLargeScreen && hasMoved ? "var(--ni-28)" : undefined}
  --list-end-spacer={isLargeScreen ? '""' : undefined}
  --height-list={mediaListHeightResolver("landscape")}
  drilldown={{
    ...seasonDrawerLink,
    source: { id: "seasons" },
    label: m.button_text_view_all(),
  }}
>
  {#snippet item(episode)}
    <SeasonEpisodeItem
      {show}
      {episode}
      {previousSeasons}
      {hasUnseenEpisodes}
      currentSeasonEpisodes={episodes}
      watchedBySeason={$watchedBySeason}
      isWatchedLoading={$isWatchedLoading}
      isCurrentEpisode={episode.number === activeEpisode}
      isConcealed={episode.number < concealBefore}
      urlOverride={buildEpisodeDrawerLink({
        season: episode.season,
        episode: episode.number,
      })}
      source="season-episode-list"
      scrollAxis={isLargeScreen ? "none" : "inline"}
    />
  {/snippet}

  {#snippet actions()}
    {#if headerActions}
      {@render headerActions()}
    {/if}
  {/snippet}
</SectionList>
