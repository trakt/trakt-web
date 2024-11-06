<script lang="ts">
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

<div class="trakt-episode">
  <div class="episode-container">
    <div class="episode-cover">
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
