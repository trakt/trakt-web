<script lang="ts">
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import CertificationTag from "$lib/components/media/tags/CertificationTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TagBar from "$lib/components/tags/TagBar.svelte";
  import type { MovieStartEntry } from "$lib/requests/models/MovieProgressEntry";
  import type { UpNextStartEntry } from "$lib/requests/models/UpNextEntry";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import MediaItem from "../../components/MediaItem.svelte";
  import { mapToMarkAsWatchedTarget } from "./mapToMarkAsWatchedTarget";
  import MovieStartWatchingSwipe from "./MovieStartWatchingSwipe.svelte";
  import UpNextSwipe from "./UpNextSwipe.svelte";

  const {
    entry,
    style,
  }: {
    entry: MovieStartEntry | UpNextStartEntry;
    style: "summary" | "cover";
  } = $props();

  const markAsWatchedTarget = $derived(mapToMarkAsWatchedTarget(entry));
  const mediaEntry = $derived.by(() => {
    if ("episode" in entry) {
      return {
        type: "show" as const,
        episode: entry.episode,
        media: entry,
      };
    }

    return {
      type: entry.type,
      media: entry,
    };
  });

  const commonActionProps = $derived({
    style: "dropdown-item" as const,
    title: entry.title,
  });
</script>

{#snippet action()}
  <MarkAsWatchedAction
    mode="act"
    style="action"
    size="small"
    title={entry.title}
    {...markAsWatchedTarget}
  />
{/snippet}

{#snippet popupActions()}
  <MarkAsWatchedAction
    style="dropdown-item"
    size="small"
    title={entry.title}
    {...markAsWatchedTarget}
  />
  <WatchlistAction {...commonActionProps} type={entry.type} media={entry} />
{/snippet}

{#snippet summaryTag()}
  <TagBar>
    <AirDateTag i18n={TagIntlProvider} airDate={entry.airDate} />

    {#if "episode" in entry}
      <EpisodeCountTag i18n={TagIntlProvider} count={entry.episode.count} />
    {:else}
      <DurationTag i18n={TagIntlProvider} runtime={entry.runtime} />
    {/if}

    {#if entry.certification}
      <CertificationTag certification={entry.certification} />
    {/if}
  </TagBar>
{/snippet}

{#snippet coverTag()}
  {#if "episode" in entry}
    <EpisodeCountTag
      i18n={TagIntlProvider}
      count={entry.episode.count}
      type="tag"
    />
  {:else}
    <DurationTag i18n={TagIntlProvider} runtime={entry.runtime} type="tag" />
  {/if}
{/snippet}

{#snippet mediaItem()}
  <MediaItem
    {...mediaEntry}
    {style}
    {popupActions}
    {action}
    tag={style === "summary" ? summaryTag : undefined}
    coverTag={style === "cover" ? coverTag : undefined}
    variant="start"
    source="start-watching"
  />
{/snippet}

{#if "episode" in entry}
  <UpNextSwipe target={markAsWatchedTarget} show={entry} {style}>
    {@render mediaItem()}
  </UpNextSwipe>
{:else}
  <MovieStartWatchingSwipe {style} media={entry}>
    {@render mediaItem()}
  </MovieStartWatchingSwipe>
{/if}
