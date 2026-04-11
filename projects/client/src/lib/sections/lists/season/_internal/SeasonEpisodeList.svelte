<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { m } from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import {
    Drawers,
    summaryDrawerNavigation,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation";
  import type { Snippet } from "svelte";
  import ViewAllButton from "../../components/ViewAllButton.svelte";
  import SeasonEpisodeItem from "./SeasonEpisodeItem.svelte";

  type SeasonEpisodeListProps = {
    show: ShowEntry;
    previousSeasons: Season[];
    episodes: EpisodeEntry[];
    title?: string;
    headerActions?: Snippet;
    subtitle?: string;
  };

  const {
    show,
    previousSeasons,
    episodes,
    title,
    subtitle,
    headerActions,
  }: SeasonEpisodeListProps = $props();

  const { history } = useUser();

  const showProgress = $derived($history?.shows.get(show.id));
  const watchedEpisodes = $derived(showProgress?.episodes);
  const hasUnseenEpisodes = $derived(!showProgress?.isWatched);

  const { buildDrawerLink } = summaryDrawerNavigation();
</script>

<SectionList
  id={`season-episode-list-${show.slug}`}
  items={episodes}
  {title}
  {subtitle}
  --height-list={mediaListHeightResolver("landscape")}
  drilldownLink={buildDrawerLink(Drawers.Seasons)}
  noscroll
>
  {#snippet item(episode)}
    <SeasonEpisodeItem
      {show}
      {episode}
      {previousSeasons}
      {watchedEpisodes}
      {hasUnseenEpisodes}
      source="season-episode-list"
    />
  {/snippet}

  {#snippet actions()}
    {#if headerActions}
      {@render headerActions()}
    {/if}

    <ViewAllButton
      href={buildDrawerLink(Drawers.Seasons)}
      label={m.button_text_view_all()}
      noscroll
      source={{ id: "seasons" }}
    />
  {/snippet}
</SectionList>
