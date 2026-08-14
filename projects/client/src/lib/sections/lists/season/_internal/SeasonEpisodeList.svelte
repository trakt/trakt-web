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
  import MoreEpisodesCard from "./MoreEpisodesCard.svelte";
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

  // Large screens mask the strip instead of scrolling it, so episodes past
  // the row's slot count are unreachable. The overflow card takes the last
  // slot and routes to the seasons drawer. Small screens scroll freely.
  const visibleCount = $derived.by(() => {
    if (!isLargeScreen) return episodes.length;
    if (episodes.length <= $itemCount) return episodes.length;
    return Math.max($itemCount - 1, 1);
  });

  const visibleEpisodes = $derived(episodes.slice(0, visibleCount));
  const overflowEpisodes = $derived(episodes.slice(visibleCount));
</script>

{#snippet moreEpisodes()}
  <MoreEpisodesCard episodes={overflowEpisodes} link={seasonDrawerLink} />
{/snippet}

<SectionList
  id={{
    scope: "season-episode-list",
    key: show.slug,
  }}
  items={visibleEpisodes}
  {title}
  {subtitle}
  trailingItem={overflowEpisodes.length > 0 ? moreEpisodes : undefined}
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
      isCurrentEpisode={episode.number === currentEpisode}
      urlOverride={buildEpisodeDrawerLink({
        season: episode.season,
        episode: episode.number,
      })}
      source="season-episode-list"
    />
  {/snippet}

  {#snippet actions()}
    {#if headerActions}
      {@render headerActions()}
    {/if}
  {/snippet}
</SectionList>
