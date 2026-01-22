<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import type { MovieProgressEntry } from "$lib/requests/queries/sync/movieProgressQuery";
  import RestoreAction from "$lib/sections/media-actions/restore/RestoreAction.svelte";
  import DropAction from "../../../media-actions/drop/DropAction.svelte";
  import MarkAsWatchedAction from "../../../media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import EpisodeItem from "../../components/EpisodeItem.svelte";
  import MovieProgressItem from "./MovieProgressItem.svelte";
  import UpNextSwipe from "./UpNextSwipe.svelte";

  type UpNextEpisodeProps = {
    episode: EpisodeProgressEntry;
    show: ShowEntry;
    status: "hidden" | "watching";
  };

  type UpNextMovieProps = {
    movie: MovieProgressEntry;
    playbackId: number;
  };

  type UpNextProps = (UpNextEpisodeProps | UpNextMovieProps) & {
    style: "cover" | "summary";
  };

  const { style, ...props }: UpNextProps = $props();
</script>

{#if "episode" in props}
  <UpNextSwipe episode={props.episode} show={props.show} {style}>
    <EpisodeItem
      episode={props.episode}
      media={props.show}
      status={props.status}
      {style}
      source="continue-watching"
      variant="next"
    >
      {#snippet popupActions()}
        <RenderFor audience="authenticated">
          <MarkAsWatchedAction
            style="dropdown-item"
            type="episode"
            title={props.episode.title}
            show={props.show}
            media={props.episode}
          />

          <DropAction
            style="dropdown-item"
            title={props.show.title}
            id={props.show.id}
            type="show"
          />

          {#if props.status === "hidden"}
            <RestoreAction
              style="dropdown-item"
              title={props.show.title}
              id={props.show.id}
            />
          {/if}
        </RenderFor>
      {/snippet}
    </EpisodeItem>
  </UpNextSwipe>
{:else}
  <MovieProgressItem
    movie={props.movie}
    playbackId={props.playbackId}
    {style}
  />
{/if}
