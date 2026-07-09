<script lang="ts">
  import SummaryPoster from "$lib/components/summary/SummaryPoster.svelte";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import SummaryPosterTags from "$lib/sections/summary/components/_internal/SummaryPosterTags.svelte";
  import { useWatchCount } from "$lib/stores/useWatchCount";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/assets";

  const {
    show,
    episode,
  }: {
    show: ShowEntry;
    episode: EpisodeEntry;
  } = $props();

  const src = $derived(
    useEpisodeSpoilerImage({ episode, show, variant: "default" }),
  );

  const { watchCount } = $derived(
    useWatchCount({ show, episode, type: "episode" }),
  );
  const postCreditsCount = $derived(episode.postCredits?.length ?? 0);
</script>

{#snippet posterTags()}
  <SummaryPosterTags {postCreditsCount} watchCount={$watchCount} />
{/snippet}

<SummaryPoster
  src={$src ?? EPISODE_COVER_PLACEHOLDER}
  alt={episode.title}
  variant="landscape"
  tags={posterTags}
/>
