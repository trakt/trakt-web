<script lang="ts">
  type DetailsGridProps = ChildrenProps;

  const { children }: DetailsGridProps = $props();
</script>

<div class="trakt-summary-details-grid">
  <div class="trakt-summary-details-grid-content">
    {@render children()}
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-details-grid {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    @include for-mobile {
      gap: var(--gap-s);
    }
  }

  .trakt-summary-details-grid-content {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, var(--ni-320)));
    gap: var(--gap-m);

    @include for-mobile {
      gap: var(--gap-s);
    }
  }
</style>
