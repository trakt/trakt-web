<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import Summary from "../../_internal/Summary.svelte";
</script>

<Summary variant="drawer">
  {#snippet poster()}
    <div class="trakt-summary-poster-container skeleton-poster">
      <Skeleton height="100%" radius="var(--border-radius-xxl)" />
    </div>
  {/snippet}


  {#snippet meta()}
    <div class="skeleton-titles">
      <div class="skeleton-title">
        <Skeleton width="60%" height="var(--glance-line-height)" />
      </div>

      <div class="skeleton-line">
        <Skeleton width="var(--ni-148)" height="var(--ni-12)" />
      </div>

      <div class="skeleton-line">
        <Skeleton width="var(--ni-220)" height="var(--ni-12)" />
      </div>

      <div class="skeleton-line">
        <Skeleton width="var(--ni-88)" height="var(--ni-12)" />
      </div>
    </div>

    <div class="skeleton-ratings">
      <Skeleton width="var(--ni-64)" height="var(--ni-24)" />
      <Skeleton width="var(--ni-64)" height="var(--ni-24)" />
    </div>

    <RenderFor audience="authenticated">
      <div class="skeleton-actions">
        <Skeleton
          width="var(--ni-280)"
          height="var(--ni-56)"
          radius="var(--border-radius-xl)"
        />
      </div>
    </RenderFor>

  {/snippet}

  <div class="skeleton-overview">
    <Skeleton height="var(--glance-line-height)" />
    <Skeleton width="60%" height="var(--glance-line-height)" />
  </div>
</Summary>

<style>
  .skeleton-poster {
    width: var(--summary-poster-width);
    aspect-ratio: 2 / 3;
  }

  .skeleton-titles {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-micro);

    width: 100%;
  }

  .skeleton-title {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: calc(var(--glance-title-lines) * 1lh);
  }

  .skeleton-line {
    display: flex;
    align-items: center;
    justify-content: center;

    min-height: var(--glance-line-height);
  }

  .skeleton-ratings {
    display: flex;
    justify-content: center;
    gap: var(--gap-s);

    min-height: var(--glance-ratings-height);
  }

  .skeleton-actions {
    display: flex;
    justify-content: center;

    min-height: var(--glance-actions-height);
  }

  .skeleton-overview {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    min-height: var(--glance-overview-height);
  }
</style>
