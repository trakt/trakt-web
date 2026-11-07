<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const { count }: { count: number } = $props();
</script>

<div class="trakt-insights-story-skeleton" aria-hidden="true">
  {#each { length: count }, index (index)}
    <div class="story">
      <div class="art">
        <Skeleton width="var(--ni-44)" height="var(--ni-44)" />
      </div>
      <div class="lines">
        <Skeleton width="55%" height="var(--ni-14)" />
        <Skeleton width="35%" height="var(--ni-12)" />
      </div>
    </div>
  {/each}
</div>

<style>
  .trakt-insights-story-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .story {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    padding: var(--gap-s);
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
  }

  .art {
    flex: none;
    display: flex;
    align-items: center;
    height: var(--ni-52);
  }

  .lines {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--ni-6);
    height: calc(var(--ni-20) + var(--gap-xxs) + 2 * var(--ni-16));
  }
</style>
