<script lang="ts">
  const {
    src,
    title,
    stars,
  }: { src: string | null; title: string; stars: number | null } = $props();
</script>

<span class="trakt-story-poster" {title}>
  {#if src}
    <img {src} alt={title} width="32" height="48" loading="lazy" decoding="async" />
  {/if}
  {#if stars !== null}
    <span class="trakt-story-poster-stars bold">{stars}</span>
  {/if}
</span>

<style>
  .trakt-story-poster {
    position: relative;
    flex: none;

    width: var(--ni-32);
    aspect-ratio: 2 / 3;
    margin-inline-start: calc(-1 * var(--ni-10));

    border: var(--ni-2) solid var(--color-card-background);
    border-radius: var(--border-radius-xs);
    overflow: hidden;

    background: color-mix(in srgb, var(--color-foreground) 10%, transparent);

    &:first-child {
      margin-inline-start: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .trakt-story-poster-stars {
    position: absolute;
    inset: auto 0 0 0;

    padding-block: var(--ni-2);

    font-size: var(--ni-10);
    line-height: 1;
    text-align: center;
    color: var(--shade-10);
    background: linear-gradient(transparent, rgb(0 0 0 / 75%));
  }
</style>
