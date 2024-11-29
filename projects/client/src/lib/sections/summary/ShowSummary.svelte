<script lang="ts">
  import BackgroundCoverImage from "$lib/components/background/BackgroundCoverImage.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { ShowSummary } from "$lib/requests/queries/movies/showSummaryQuery";
  import { useMarkAsWatched } from "$lib/stores/useMarkAsWatched";
  import { useWatchlist } from "$lib/stores/useWatchlist";
  import MediaSummaryContainer from "./components/MediaSummaryContainer.svelte";
  import MediaSummaryInfo from "./components/MediaSummaryInfo.svelte";
  import type { MediaSummaryProps } from "./components/MediaSummaryProps";

  const { media: show, ratings }: MediaSummaryProps<ShowSummary> = $props();

  const type = "movie";

  const { markAsWatched, isMarkingAsWatched, isWatched } = useMarkAsWatched({
    type,
    id: show.id,
  });

  const { isAddingToWatchlist, watchlist, isWatchlisted } = useWatchlist({
    type,
    id: show.id,
  });
</script>

<BackgroundCoverImage src={show.cover.url} {type} />

<MediaSummaryContainer>
  {#snippet poster()}
    <SummaryPoster src={show.poster.url} alt={show.title}>
      {#snippet actions()}
        <Button
          label={m.add_to_watchlist_label({ title: show.title })}
          variant="custom"
          onclick={() => watchlist()}
          disabled={$isAddingToWatchlist || $isWatchlisted}
          --color-background-button="var(--blue-200)"
          --color-foreground-button="var(--blue-800)"
        >
          {m.add_to_watchlist()}
          {#snippet icon()}
            <PlusIcon />
          {/snippet}
        </Button>

        <Button
          label={m.mark_as_watched_label({ title: show.title })}
          variant="custom"
          onclick={() => markAsWatched()}
          disabled={$isMarkingAsWatched || $isWatched}
          --color-background-button="var(--purple-100)"
          --color-foreground-button="var(--purple-600)"
        >
          {m.mark_as_watched()}
          {#snippet icon()}
            <CheckIcon size="small" />
          {/snippet}
        </Button>
      {/snippet}
    </SummaryPoster>
  {/snippet}

  <MediaSummaryInfo media={show} {ratings} />
</MediaSummaryContainer>
