<script lang="ts">
  import type { Snippet } from "svelte";

  const {
    title,
    detail,
    art,
  }: { title: string; detail: string; art: Snippet } = $props();
</script>

<div class="trakt-insights-story">
  <div class="trakt-insights-story-art">
    {@render art()}
  </div>
  <p>
    <span class="bold">{title}</span>
    <span class="secondary small">{detail}</span>
  </p>
</div>

<style>
  .trakt-insights-story {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    padding: var(--gap-s);
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);

    p {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--gap-xxs);
      min-width: 0;
      min-height: calc(var(--ni-20) + var(--gap-xxs) + 2 * var(--ni-16));
      margin: 0;

      span:first-child {
        line-height: var(--ni-20);
      }

      span:last-child {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        overflow: hidden;
        line-height: var(--ni-16);
      }
    }
  }

  .trakt-insights-story-art {
    flex: none;
    display: flex;
    align-items: center;
    min-width: var(--ni-44);
    height: var(--ni-52);
  }

  .trakt-insights-story-art :global(.trakt-insights-badge) {
    display: flex;
    align-items: center;
    justify-content: center;

    min-width: var(--ni-44);
    height: var(--ni-44);
    padding-inline: var(--ni-6);

    border-radius: var(--border-radius-s);
    color: var(--insights-story-color);
    background: color-mix(in srgb, var(--insights-story-color) 16%, transparent);
    font-size: var(--ni-12);
    font-weight: bold;
    white-space: nowrap;
  }
</style>
