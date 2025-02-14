<script lang="ts">
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import type { ShowInput } from "$lib/models/MediaInput";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { Snippet } from "svelte";
  import MediaSummaryCard from "../components/MediaSummaryCard.svelte";

  const {
    episode,
    show,
    tags,
    action,
    badges,
  }: {
    episode: EpisodeEntry;
    show: ShowInput;
    tags?: Snippet;
    action?: Snippet;
    badges?: Snippet;
  } = $props();

  const src = $derived(useEpisodeSpoilerImage({ episode, show }));
</script>

<MediaSummaryCard
  media={show}
  {episode}
  {tags}
  {action}
  {badges}
  type="episode"
  variant="thumb"
/>
