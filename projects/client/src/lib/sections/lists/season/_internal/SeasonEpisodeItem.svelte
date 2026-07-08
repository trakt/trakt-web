<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import IconWrapper from "$lib/components/icons/IconWrapper.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Season } from "$lib/requests/models/Season";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import EpisodeItem from "$lib/sections/lists/components/EpisodeItem.svelte";
  import type { BaseItemProps } from "$lib/sections/lists/components/models/BaseItemProps";
  import type { EpisodeUrlOverride } from "$lib/sections/lists/components/models/EpisodeUrlOverride";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchedUntilHereDrawer from "$lib/sections/media-actions/mark-as-watched/_internal/watch-until-here/WatchedUntilHereDrawer.svelte";
  import { useWatchUntilHereEpisodes } from "$lib/sections/media-actions/mark-as-watched/_internal/watch-until-here/useWatchUntilHereEpisodes.ts";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import { scrollActiveItemIntoView } from "$lib/utils/actions/scrollActiveItemIntoView";

  type SeasonEpisodeItemProps = {
    show: ShowEntry;
    episode: EpisodeEntry;
    previousSeasons: Season[];
    hasUnseenEpisodes: boolean;
    currentSeasonEpisodes: EpisodeEntry[];
    watchedBySeason: ReadonlyMap<number, ReadonlySet<number>>;
    isWatchedLoading: boolean;
    isCurrentEpisode?: boolean;
    style?: BaseItemProps["style"];
    source: string;
    urlOverride?: EpisodeUrlOverride;
  };

  const {
    show,
    episode,
    previousSeasons,
    hasUnseenEpisodes,
    currentSeasonEpisodes,
    watchedBySeason,
    isWatchedLoading,
    isCurrentEpisode = false,
    style,
    source,
    urlOverride,
  }: SeasonEpisodeItemProps = $props();

  const isFuture = $derived(episode.effectiveReleaseDate > new Date());
  const hasBulkMarkAsWatched = $derived(
    hasUnseenEpisodes && episode.effectiveReleaseDate && !isFuture,
  );

  const { isWatchable } = $derived(
    useMarkAsWatched({ type: "episode", media: episode, show }),
  );

  const isActionable = $derived(
    !isFuture && (isWatchable || hasBulkMarkAsWatched),
  );
  const variant = $derived(isFuture ? "upcoming" : "default");

  const src = $derived(
    useEpisodeSpoilerImage({
      episode,
      show,
      variant,
    }),
  );

  let isWatchUntilDrawerOpen = $state(false);

  const watchUntilResolver = $derived.by(() => {
    if (!isWatchUntilDrawerOpen) return null;
    return useWatchUntilHereEpisodes({
      showSlug: show.slug,
      targetEpisode: { season: episode.season, number: episode.number },
      previousSeasons,
      currentSeasonEpisodes,
      watchedBySeason,
    });
  });
  const resolvedEpisodes = $derived(watchUntilResolver?.episodes);
  const isResolvingEpisodes = $derived(watchUntilResolver?.isLoading);
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
      <DropdownItem
        onclick={() => (isWatchUntilDrawerOpen = true)}
        label={m.button_label_watched_until_here({ title: show.title })}
        style="flat"
        color="default"
        disabled={isWatchedLoading}
        variant="secondary"
      >
        {m.button_text_watched_until_here()}
        {#snippet icon()}
          <IconWrapper isLoading={isWatchedLoading}>
            <TrackIcon state="unwatched" />
          </IconWrapper>
        {/snippet}
      </DropdownItem>
    {/if}
  </RenderFor>
{/snippet}

{#snippet episodeItem()}
  <EpisodeItem
    {episode}
    media={show}
    {style}
    popupActions={isActionable ? popupActions : undefined}
    variant={isFuture ? "upcoming" : "default"}
    context="show"
    {source}
    {urlOverride}
    coverUrl={$src}
  />
{/snippet}

{#if isCurrentEpisode}
  <div
    use:scrollActiveItemIntoView={isCurrentEpisode}
    class="trakt-season-episode-item"
  >
    {@render episodeItem()}
  </div>
{:else}
  {@render episodeItem()}
{/if}

{#if isWatchUntilDrawerOpen && resolvedEpisodes}
  <WatchedUntilHereDrawer
    {show}
    title={show.title}
    episodes={$resolvedEpisodes ?? []}
    isResolvingEpisodes={$isResolvingEpisodes ?? false}
    onClose={() => (isWatchUntilDrawerOpen = false)}
  />
{/if}
