<script lang="ts">
  import {
    EpisodeFinaleType,
    EpisodePremiereType,
    type EpisodeType,
  } from "$lib/models/EpisodeType";
  import type { EpisodeIntl } from "./EpisodeIntl";

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

<div class="trakt-episode">
  <div class="episode-container">
    <div class="episode-cover">
      <div class="episode-tags">
        {#if isFinale}
          <p class="episode-finale-tag ellipsis">
            {i18n.finaleText({ type: type as EpisodeFinaleType })}
          </p>
        {/if}
        {#if isPremiere}
          <p class="episode-premiere-tag ellipsis">
            {i18n.premiereText({ type: type as EpisodePremiereType })}
          </p>
        {/if}
        <p class="episode-timestamp-tag ellipsis">
          {i18n.timestampText(airedDate) ?? airedDate}
        </p>
      </div>
      <img src={`${posterUrl}`} alt={`${showTitle} - ${episodeTitle}`} />
    </div>
    <div class="episode-details">
      <p class="episode-show-title ellipsis">{showTitle}</p>
      <p class="episode-title ellipsis">
        {seasonNumber}x{episodeNumber} - {episodeTitle}
      </p>
    </div>
  </div>
</div>

<style>
  .episode-container {
    width: 12.5rem;

    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: 0px 4px 8px 0px
      color-mix(in srgb, var(--color-card-background) 25%, transparent 75%);
  }

  .episode-tags {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 0.25rem;

    .episode-premiere-tag,
    .episode-finale-tag,
    .episode-timestamp-tag {
      font-size: 0.625rem;
      font-style: normal;
      font-weight: 700;
      letter-spacing: 0.025rem;

      display: flex;
      height: 0.85rem;
      margin: 0;
      padding: 0.125rem 0.5rem;
      align-items: center;

      border-radius: 1.125rem;
    }

    .episode-finale-tag {
      text-transform: uppercase;

      background: var(--color-background-finale-tag);
      color: var(--color-text-finale-tag);
    }

    .episode-premiere-tag {
      text-transform: uppercase;

      background: var(--color-background-premiere-tag);
      color: var(--color-text-premiere-tag);
    }

    .episode-timestamp-tag {
      &::first-letter {
        text-transform: capitalize;
      }

      background: var(--color-background-time-tag);
      color: var(--color-text-time-tag);
    }
  }

  .episode-cover {
    position: relative;
    height: 7.5rem;
    align-self: stretch;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &::before {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 12.5rem;
      height: 2.5rem;
      flex-shrink: 0;

      background: linear-gradient(
        180deg,
        transparent 0%,
        color-mix(in srgb, var(--color-card-background) 2%, transparent 98%) 5%,
        color-mix(in srgb, var(--color-card-background) 4%, transparent 96%) 9%,
        color-mix(in srgb, var(--color-card-background) 7%, transparent 93%) 13%,
        color-mix(in srgb, var(--color-card-background) 10%, transparent 90%)
          17%,
        color-mix(in srgb, var(--color-card-background) 14%, transparent 86%)
          20%,
        color-mix(in srgb, var(--color-card-background) 18%, transparent 82%)
          24%,
        color-mix(in srgb, var(--color-card-background) 23%, transparent 77%)
          29%,
        color-mix(in srgb, var(--color-card-background) 29%, transparent 71%)
          34%,
        color-mix(in srgb, var(--color-card-background) 35%, transparent 65%)
          40%,
        color-mix(in srgb, var(--color-card-background) 43%, transparent 57%)
          46%,
        color-mix(in srgb, var(--color-card-background) 52%, transparent 48%)
          54%,
        color-mix(in srgb, var(--color-card-background) 62%, transparent 38%)
          63%,
        color-mix(in srgb, var(--color-card-background) 73%, transparent 27%)
          74%,
        color-mix(in srgb, var(--color-card-background) 86%, transparent 14%)
          86%,
        var(--color-card-background) 100%
      );
    }
  }

  .episode-details {
    display: flex;
    padding: 0.5rem;
    flex-direction: column;
    gap: 0.25rem;

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

    .ellipsis {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
