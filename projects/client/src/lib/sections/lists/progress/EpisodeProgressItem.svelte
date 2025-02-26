<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { EpisodeProgressEntry } from "$lib/requests/models/EpisodeProgressEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import RestoreAction from "$lib/sections/media-actions/restore/RestoreAction.svelte";
  import DropAction from "../../media-actions/drop/DropAction.svelte";
  import MarkAsWatchedAction from "../../media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import EpisodeCard from "../components/EpisodeCard.svelte";
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
</script>

<EpisodeCard {episode} {show} {status} {style} variant="next">
  {#snippet popupActions()}
    <RenderFor audience="authenticated">
      <MarkAsWatchedAction
        style="dropdown-item"
        type="episode"
        title={episode.title}
        {show}
        {episode}
        media={episode}
      />
      {#if $isNitroEnabled}
        <DropAction style="dropdown-item" title={show.title} id={show.id} />
      {/if}

      {#if $isNitroEnabled && isHidden}
        <RestoreAction style="dropdown-item" title={show.title} id={show.id} />
      {/if}
    </RenderFor>
  {/snippet}
</EpisodeCard>
