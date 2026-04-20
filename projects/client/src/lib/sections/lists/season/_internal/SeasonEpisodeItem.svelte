<script lang="ts">
  import type { WatchedEpisode } from "$lib/features/auth/queries/currentUserHistoryQuery.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import type { BaseItemProps } from "$lib/sections/lists/components/models/BaseItemProps";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import { getEpisodesUntil } from "./getEpisodesUntil";
  import { WatchedUntilHereIntlProvider } from "./WatchedUntilHereIntlProvider";

  type SeasonEpisodeItemProps = {
    show: ShowEntry;
    episode: EpisodeEntry;
    previousSeasons: Season[];
    watchedEpisodes?: WatchedEpisode[];
    hasUnseenEpisodes: boolean;
    style?: BaseItemProps["style"];
    source: string;
    coverUrl?: string;
  };

  const {
    show,
    episode,
    previousSeasons,
    watchedEpisodes,
    hasUnseenEpisodes,
    style,
    source,
    coverUrl,
  }: SeasonEpisodeItemProps = $props();

  const isFuture = $derived(episode.effectiveReleaseDate > new Date());
  const hasBulkMarkAsWatched = $derived(
    hasUnseenEpisodes && episode.effectiveReleaseDate && !isFuture,
  );

  const { isWatchable } = $derived(
    useMarkAsWatched({ type: "episode", media: episode, show }),
  );

  const isActionable = $derived(isWatchable || hasBulkMarkAsWatched);
</script>

{#snippet popupActions()}
  <RenderFor audience="authenticated">
    <MarkAsWatchedAction
      style="dropdown-item"
      type="episode"
      title={episode.title}
      {show}
      media={episode}
      mode="hybrid"
    />
    {#if hasBulkMarkAsWatched}
      <MarkAsWatchedAction
        style="dropdown-item"
        type="show"
        size="small"
        i18n={WatchedUntilHereIntlProvider}
        title={show.title}
        media={{
          id: show.id,
          effectiveReleaseDate: show.effectiveReleaseDate,
          seasons: getEpisodesUntil({
            previousSeasons,
            episode,
            watchedEpisodes,
          }),
        }}
      />
    {/if}
  </RenderFor>
{/snippet}

<EpisodeItem
  {episode}
  media={show}
  {style}
  {coverUrl}
  popupActions={isActionable ? popupActions : undefined}
  variant={isFuture ? "upcoming" : "default"}
  context="show"
  {source}
/>
