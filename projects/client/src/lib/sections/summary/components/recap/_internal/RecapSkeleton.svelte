<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const LEAD_LINE_WIDTHS = ["100%", "96%", "100%", "88%", "54%"];
  const REST_LINE_WIDTHS = ["100%", "64%"];
  const MOMENT_COUNT = 2;
  const PERSON_COUNT = 4;
  const CHAPTER_COUNT = 4;

  const { hasTabs = false }: { hasTabs?: boolean } = $props();
</script>

<div class="trakt-recap-skeleton" aria-hidden="true">
  {#if hasTabs}
    <Skeleton height="var(--ni-40)" radius="var(--border-radius-pill)" />
  {/if}

  <div class="skeleton-summary">
    <div class="skeleton-lead">
      {#each LEAD_LINE_WIDTHS as width, index (index)}
        <div class="skeleton-lead-line">
          <Skeleton {width} height="var(--ni-20)" />
        </div>
      {/each}
    </div>
    <div class="skeleton-rest">
      {#each REST_LINE_WIDTHS as width, index (index)}
        <div class="skeleton-rest-line">
          <Skeleton {width} height="var(--ni-14)" />
        </div>
      {/each}
    </div>
    <div class="skeleton-toggle">
      <Skeleton width="var(--ni-72)" height="var(--ni-14)" />
    </div>
  </div>

  <div class="skeleton-section">
    <div class="skeleton-heading">
      <Skeleton width="var(--ni-120)" height="var(--ni-18)" />
      <Skeleton width="var(--ni-104)" height="var(--ni-32)" radius="var(--ni-16)" />
    </div>
    <div class="skeleton-moments">
      {#each { length: MOMENT_COUNT }, index (index)}
        <div class="skeleton-moment">
          <Skeleton height="var(--ni-168)" radius="var(--border-radius-l)" />
        </div>
      {/each}
    </div>
    <div class="skeleton-dots">
      <Skeleton width="var(--ni-72)" height="var(--ni-8)" radius="var(--ni-3)" />
    </div>
  </div>

  <div class="skeleton-section">
    <div class="skeleton-heading">
      <Skeleton width="var(--ni-160)" height="var(--ni-18)" />
    </div>
    <div class="skeleton-people">
      {#each { length: PERSON_COUNT }, index (index)}
        <Skeleton height="var(--ni-128)" radius="var(--border-radius-m)" />
      {/each}
    </div>
  </div>

  <div class="skeleton-section">
    <div class="skeleton-heading">
      <Skeleton width="var(--ni-96)" height="var(--ni-18)" />
    </div>
    <div class="skeleton-chapters">
      {#each { length: CHAPTER_COUNT }, index (index)}
        <Skeleton height="var(--ni-56)" radius="var(--border-radius-s)" />
      {/each}
    </div>
  </div>
</div>

<style lang="scss">
  .trakt-recap-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);

    .skeleton-summary {
      display: flex;
      flex-direction: column;
      gap: var(--ni-10);
    }

    .skeleton-lead-line {
      display: flex;
      align-items: center;
      height: var(--ni-28);
    }

    .skeleton-rest-line {
      display: flex;
      align-items: center;
      height: var(--ni-22);
    }

    .skeleton-toggle {
      display: flex;
      align-items: center;
      height: var(--ni-32);
    }

    .skeleton-section {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    .skeleton-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;

      min-height: var(--ni-32);
    }

    .skeleton-moments {
      display: flex;
      gap: var(--gap-s);

      margin-inline: calc(-1 * var(--drawer-padding, var(--gap-m)));
      padding-inline: var(--drawer-padding, var(--gap-m));
      overflow: hidden;

    }

    .skeleton-dots {
      display: flex;
      justify-content: center;
    }

    .skeleton-moment {
      flex: 0 0 min(var(--ni-292), 80%);
    }

    .skeleton-people {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--gap-xs);
    }

    .skeleton-chapters {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);
    }
  }
</style>
