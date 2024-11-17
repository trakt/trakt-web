<script lang="ts">
  import {
    EpisodeFinaleType,
    EpisodePremiereType,
    type EpisodeType,
  } from "$lib/models/EpisodeType";
  import type { Snippet } from "svelte";
  import type { EpisodeIntl } from "../EpisodeIntl";
  import EpisodeFinaleTag from "../tags/EpisodeFinaleTag.svelte";
  import EpisodePremiereTag from "../tags/EpisodePremiereTag.svelte";

  type EpisodeCoverProps = {
    i18n: EpisodeIntl;
    src: string;
    alt: string;
    tags: Snippet;
    type: EpisodeType;
    isLoading?: boolean;
  };

  const { i18n, src, alt, tags, type, isLoading }: EpisodeCoverProps = $props();

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

  let isImagePending = $state(true);
  $effect(() => {
    if (!isLoading) {
      return;
    }

    isImagePending = true;
  });
</script>

<div
  class="episode-cover"
  class:episode-cover-loading={isImagePending || isLoading}
>
  <div class="episode-tags">
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
    {@render tags()}
  </div>
  <div class="episode-cover-image">
    <img {src} {alt} onload={() => (isImagePending = false)} />
  </div>
</div>

<style>
  .episode-tags {
    --episode-tag-padding: 0.5rem;

    width: calc(100% - var(--episode-tag-padding) * 2);
    position: absolute;
    padding: var(--episode-tag-padding);

    z-index: 1;
    bottom: 0;
    left: 0;

    box-sizing: border-box;
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .episode-cover {
    position: relative;
  }

  .episode-cover-loading {
    .episode-cover-image {
      opacity: 0;
      filter: blur(0.25rem);
    }
  }

  .episode-cover-image {
    position: relative;
    height: 7.5rem;
    align-self: stretch;
    transition:
      opacity 500ms ease-in-out,
      filter 150ms ease-in-out;

    :global(img) {
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
</style>
