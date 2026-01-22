<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import CertificationTag from "$lib/components/media/tags/CertificationTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TagBar from "$lib/components/tags/TagBar.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import MediaItem from "../../components/MediaItem.svelte";
  import { type ProgressEntry } from "../useUpNextList";
  import MovieStartWatchingSwipe from "./MovieStartWatchingSwipe.svelte";
  import UpNextSwipe from "./UpNextSwipe.svelte";

  const {
    entry,
    style,
  }: {
    entry: ProgressEntry;
    style: "summary" | "cover";
  } = $props();

  const target = $derived(
    "show" in entry
      ? { type: "show" as const, media: entry.show, episode: entry }
      : { type: "movie" as const, media: entry },
  );

  const markAsWatchedProps = $derived(
    target.type === "show"
      ? { type: "episode" as const, show: target.media, media: target.episode }
      : { type: "movie" as const, media: target.media },
  );

  const commonActionProps = $derived({
    style: "dropdown-item" as const,
    title: target.media.title,
  });
</script>

{#snippet action()}
  <MarkAsWatchedAction
    mode="act"
    style="action"
    size="small"
    title={entry.title}
    {...markAsWatchedProps}
  />
{/snippet}

{#snippet popupActions()}
  <MarkAsWatchedAction
    style="dropdown-item"
    size="small"
    title={entry.title}
    {...markAsWatchedProps}
  />
  <WatchlistAction
    {...commonActionProps}
    type={target.type}
    media={target.media}
  />
{/snippet}

{#snippet summaryTag()}
  <TagBar>
    <AirDateTag i18n={TagIntlProvider} airDate={target.media.airDate} />

    {#if "episode" in target.media}
      <EpisodeCountTag
        i18n={TagIntlProvider}
        count={target.media.episode.count}
      />
    {:else}
      <DurationTag i18n={TagIntlProvider} runtime={target.media.runtime} />
    {/if}

    {#if target.media.certification}
      <CertificationTag certification={target.media.certification} />
    {/if}
  </TagBar>
{/snippet}

{#snippet mediaItem()}
  <MediaItem
    {...target}
    {style}
    {popupActions}
    {action}
    tag={style === "summary" ? summaryTag : undefined}
    variant="start"
    source="start-watching"
  />
{/snippet}

{#if "show" in entry}
  <UpNextSwipe episode={entry} show={entry.show} {style}>
    {@render mediaItem()}
  </UpNextSwipe>
{:else}
  <MovieStartWatchingSwipe {style} media={entry}>
    {@render mediaItem()}
  </MovieStartWatchingSwipe>
{/if}
