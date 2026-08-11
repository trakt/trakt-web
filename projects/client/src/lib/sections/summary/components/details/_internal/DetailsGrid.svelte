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
  }

  /*
    One fact per ruled row - label at the start, values at the end - instead
    of the two-column card grid. The rows read top to bottom like a spec
    sheet, which is what this data is.
  */
  .trakt-summary-details-grid-content {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    > :global(* + *) {
      padding-top: var(--ni-12);
      border-top: var(--ni-1) solid var(--color-hairline);
    }
  }
</style>
