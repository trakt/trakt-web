<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const LEAD_LINE_WIDTHS = ["100%", "92%", "58%"];
  const REST_LINE_WIDTHS = ["100%", "94%", "100%", "72%"];
</script>

<div class="trakt-movie-lore-skeleton" aria-hidden="true">
  <Skeleton height="var(--ni-40)" radius="var(--border-radius-pill)" />

  <div class="skeleton-setup">
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
  </div>

  <div class="skeleton-section">
    <div class="skeleton-heading">
      <Skeleton width="var(--ni-160)" height="var(--ni-18)" />
    </div>
    <Skeleton height="var(--ni-128)" radius="var(--border-radius-l)" />
  </div>
</div>

<style lang="scss">
  .trakt-movie-lore-skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--ni-28);

    .skeleton-setup {
      display: flex;
      flex-direction: column;
      gap: var(--ni-10);
    }

    .skeleton-lead-line {
      display: flex;
      align-items: center;
      height: var(--ni-28);
    }

    .skeleton-rest {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);
    }

    .skeleton-rest-line {
      display: flex;
      align-items: center;
      height: var(--ni-22);
    }

    .skeleton-section {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    .skeleton-heading {
      display: flex;
      align-items: center;

      min-height: var(--ni-32);
    }
  }
</style>
