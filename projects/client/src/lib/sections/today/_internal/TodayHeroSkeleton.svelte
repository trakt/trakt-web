<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";
</script>

<div class="trakt-today-hero-skeleton" aria-hidden="true">
  <div class="hero-skeleton-people">
    <Skeleton width="var(--ni-32)" height="var(--ni-32)" radius="50%" />
    <Skeleton width="var(--ni-120)" height="var(--ni-14)" />
  </div>
  <div class="hero-skeleton-text">
    <Skeleton width="60%" height="var(--ni-20)" />
    <Skeleton width="80%" height="var(--ni-12)" />
    <Skeleton
      width="var(--ni-120)"
      height="var(--ni-40)"
      radius="var(--border-radius-m)"
    />
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-hero-skeleton {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    min-height: calc(var(--ni-320) + var(--ni-80));
    padding: var(--gap-m);

    border-radius: var(--border-radius-xl);
    background: var(--color-card-background);

    @include for-mobile {
      min-height: var(--ni-200);
    }
  }

  .hero-skeleton-people {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }

  .hero-skeleton-text {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
