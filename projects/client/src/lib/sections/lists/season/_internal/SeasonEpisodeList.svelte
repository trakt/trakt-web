<script lang="ts">
  import ShadowList from "$lib/components/lists/section-list/ShadowList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { getEpisodesUntil } from "./getEpisodesUntil";
  import { WatchedUntilHereIntlProvider } from "./WatchedUntilHereIntlProvider";

  type SeasonEpisodeListProps = {
    show: ShowEntry;
    previousSeasons: Season[];
    episodes: EpisodeEntry[];
    title?: string;
    subtitle?: string;
  };

  const {
    show,
    previousSeasons,
    episodes,
    title,
    subtitle,
  }: SeasonEpisodeListProps = $props();

  const { history } = useUser();

  const showProgress = $derived($history?.shows.get(show.id));
  const watchedEpisodes = $derived(showProgress?.episodes);

  const hasUnseenEpisodes = $derived(!Boolean(showProgress?.isWatched));

  const hasBulkMarkAsWatched = (episode: EpisodeEntry) =>
    hasUnseenEpisodes && episode.airDate && episode.airDate <= new Date();
</script>

<ShadowList
  id={`season-episode-list-${show.slug}`}
  items={episodes}
  {title}
  {subtitle}
  --height-list={mediaListHeightResolver("landscape")}
>
  {#snippet item(episode)}
    {#snippet popupActions()}
      <RenderFor audience="authenticated">
        <MarkAsWatchedAction
          style="dropdown-item"
          type="show"
          size="small"
          i18n={WatchedUntilHereIntlProvider}
          title={show.title}
          media={{
            id: show.id,
            airDate: show.airDate,
            seasons: getEpisodesUntil({
              previousSeasons,
              episode,
              watchedEpisodes,
            }),
          }}
        />
      </RenderFor>
    {/snippet}

    <EpisodeItem
      {episode}
      {show}
      popupActions={hasBulkMarkAsWatched(episode) ? popupActions : undefined}
      variant={episode.airDate > new Date() ? "upcoming" : "default"}
      context="show"
      source="season-episode-list"
    />
  {/snippet}
</ShadowList>
