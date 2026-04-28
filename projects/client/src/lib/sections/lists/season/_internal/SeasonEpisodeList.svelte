<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { m } from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import {
    SummaryDrawers,
    summaryDrawerNavigation,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation";
  import { countWatchedEpisodes } from "$lib/utils/media/countWatchedEpisodes";
  import type { Snippet } from "svelte";
  import ViewAllButton from "../../components/ViewAllButton.svelte";
  import SeasonEpisodeItem from "./SeasonEpisodeItem.svelte";
  import { useShowWatchedEpisodes } from "./useShowWatchedEpisodes";

  type SeasonEpisodeListProps = {
    show: ShowEntry;
    previousSeasons: Season[];
    episodes: EpisodeEntry[];
    title?: string;
    headerActions?: Snippet;
    subtitle?: string;
    coverUrl?: string;
  };

  const {
    show,
    previousSeasons,
    episodes,
    title,
    subtitle,
    headerActions,
    coverUrl,
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

  const { buildDrawerLink } = summaryDrawerNavigation();
  const seasonDrawerLink = $derived(buildDrawerLink(SummaryDrawers.Seasons));
</script>

<SectionList
  id={`season-episode-list-${show.slug}`}
  items={episodes}
  {title}
  {subtitle}
  --height-list={mediaListHeightResolver("landscape")}
  drilldownLink={seasonDrawerLink.href}
  noscroll={seasonDrawerLink.noscroll}
  replacestate={seasonDrawerLink.replacestate}
>
  {#snippet item(episode)}
    <SeasonEpisodeItem
      {show}
      {episode}
      {previousSeasons}
      {hasUnseenEpisodes}
      watchedBySeason={$watchedBySeason}
      isWatchedLoading={$isWatchedLoading}
      {coverUrl}
      source="season-episode-list"
    />
  {/snippet}

  {#snippet actions()}
    {#if headerActions}
      {@render headerActions()}
    {/if}

    <ViewAllButton
      {...seasonDrawerLink}
      label={m.button_text_view_all()}
      noscroll
      source={{ id: "seasons" }}
    />
  {/snippet}
</SectionList>
