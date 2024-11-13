<script lang="ts">
  import { type EpisodeType } from "$lib/models/EpisodeType";
  import EpisodeCard from "../card/EpisodeCard.svelte";
  import EpisodeCover from "../card/EpisodeCover.svelte";
  import EpisodeFooter from "../card/EpisodeFooter.svelte";
  import EpisodeTimeTag from "../tags/EpisodeTimeTag.svelte";

  type EpisodeProps = {
    posterUrl: string;
    showTitle: string;
    episodeTitle: string;
    episodeNumber: number;
    seasonNumber: number;
  };

  const {
    posterUrl,
    showTitle,
    episodeTitle,
    episodeNumber,
    seasonNumber,
  }: EpisodeProps = $props();
</script>

<EpisodeCard>
  <EpisodeCover src={`${posterUrl}`} alt={`${showTitle} - ${episodeTitle}`}>
    {#snippet tags()}
      <EpisodeTimeTag>
        {"TODO: add progress tag"}
      </EpisodeTimeTag>
    {/snippet}
  </EpisodeCover>
  <EpisodeFooter>
    <p class="episode-show-title ellipsis">{showTitle}</p>
    <p class="episode-title ellipsis">
      {seasonNumber}x{episodeNumber} - {episodeTitle}
    </p>
  </EpisodeFooter>
</EpisodeCard>

<style>
  .episode-show-title {
    color: var(--color-text-primary);
    margin: 0;

    font-size: 1rem;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }

  .episode-title {
    color: var(--color-text-secondary);
    margin: 0;

    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }
</style>
