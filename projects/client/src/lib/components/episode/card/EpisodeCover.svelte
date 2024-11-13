<script lang="ts">
  import type { Snippet } from "svelte";

  type EpisodeCoverProps = {
    src: string;
    alt: string;
    tags: Snippet;
  };

  const { src, alt, tags }: EpisodeCoverProps = $props();
</script>

<div class="episode-cover">
  <div class="episode-tags">
    {@render tags()}
  </div>
  <img {src} {alt} />
</div>

<style>
  .episode-cover {
    position: relative;
    height: 7.5rem;
    align-self: stretch;

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

  .episode-tags {
    position: absolute;
    bottom: 0.5rem;
    left: 0.5rem;
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    gap: 0.25rem;
  }
</style>
