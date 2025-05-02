<script lang="ts">
  import SwipeX from "$lib/components/gestures/SwipeX.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import MarkAsWatchedSwipeIndicator from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedSwipeIndicator.svelte";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import RestoreAction from "$lib/sections/media-actions/restore/RestoreAction.svelte";
  import DropAction from "../../media-actions/drop/DropAction.svelte";
  import MarkAsWatchedAction from "../../media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import EpisodeItem from "../components/EpisodeItem.svelte";
  import { useUpNextExperiment } from "./useUpNextExperiment";

  type UpNextEpisodeProps = {
    episode: EpisodeProgressEntry;
    show: ShowEntry;
    status: "hidden" | "watching";
    style: "cover" | "summary";
  };

  const { enabled: isNitroEnabled } = useUpNextExperiment();

  const { episode, show, status, style }: UpNextEpisodeProps = $props();

  const isHidden = $derived(status === "hidden");

  const { markAsWatched } = $derived(
    useMarkAsWatched({
      type: "episode",
      media: [episode],
      show: show,
      episode: episode,
    }),
  );
</script>

{#snippet card()}
  <EpisodeItem {episode} {show} {status} {style} variant="next">
    {#snippet popupActions()}
      <RenderFor audience="authenticated">
        <MarkAsWatchedAction
          style="dropdown-item"
          type="episode"
          allowRewatch
          title={episode.title}
          {show}
          {episode}
          media={episode}
        />
        {#if $isNitroEnabled}
          <DropAction style="dropdown-item" title={show.title} id={show.id} />
        {/if}

        {#if $isNitroEnabled && isHidden}
          <RestoreAction
            style="dropdown-item"
            title={show.title}
            id={show.id}
          />
        {/if}
      </RenderFor>
    {/snippet}
  </EpisodeItem>
{/snippet}

{#if style === "summary"}
  <SwipeX
    children={card}
    directions={["left"]}
    classList="trakt-up-next-episode"
    onSwipe={markAsWatched}
    --indicator-height="var(--height-summary-card-cover)"
  >
    {#snippet indicator({ isActive })}
      <MarkAsWatchedSwipeIndicator {isActive} />
    {/snippet}
  </SwipeX>
{:else}
  {@render card()}
{/if}
