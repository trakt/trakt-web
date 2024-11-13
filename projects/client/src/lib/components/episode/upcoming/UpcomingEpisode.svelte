<script lang="ts">
  import {
    EpisodeFinaleType,
    EpisodePremiereType,
    type EpisodeType,
  } from "$lib/models/EpisodeType";
  import EpisodeCard from "../card/EpisodeCard.svelte";
  import EpisodeCover from "../card/EpisodeCover.svelte";
  import EpisodeFooter from "../card/EpisodeFooter.svelte";
  import type { EpisodeIntl } from "../EpisodeIntl";
  import EpisodeFinaleTag from "../tags/EpisodeFinaleTag.svelte";
  import EpisodePremiereTag from "../tags/EpisodePremiereTag.svelte";
  import EpisodeTimeTag from "../tags/EpisodeTimeTag.svelte";

  type EpisodeProps = {
    i18n: EpisodeIntl;
    posterUrl: string;
    showTitle: string;
    episodeTitle: string;
    episodeNumber: number;
    seasonNumber: number;
    airedDate: Date;
    type: EpisodeType;
  };

  const {
    i18n,
    posterUrl,
    showTitle,
    episodeTitle,
    episodeNumber,
    seasonNumber,
    airedDate,
    type,
  }: EpisodeProps = $props();

  const isPremiere = $derived(
    [
      EpisodePremiereType.MidSeason,
      EpisodePremiereType.Season,
      EpisodePremiereType.Series,
    ].includes(type as EpisodePremiereType),
  );

  const isFinale = $derived(
    [
      EpisodeFinaleType.MidSeason,
      EpisodeFinaleType.Season,
      EpisodeFinaleType.Series,
    ].includes(type as EpisodeFinaleType),
  );
</script>

<EpisodeCard>
  <EpisodeCover src={`${posterUrl}`} alt={`${showTitle} - ${episodeTitle}`}>
    {#snippet tags()}
      {#if isFinale}
        <EpisodeFinaleTag>
          {i18n.finaleText({ type: type as EpisodeFinaleType })}
        </EpisodeFinaleTag>
      {/if}
      {#if isPremiere}
        <EpisodePremiereTag>
          {i18n.premiereText({ type: type as EpisodePremiereType })}
        </EpisodePremiereTag>
      {/if}
      <EpisodeTimeTag>
        {i18n.timestampText(airedDate) ?? airedDate}
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
