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
    Two facts per row, label over values, no rules - the ruled one-per-row
    spec sheet doubled the drawer's height and the hairlines read as clutter
    at this density. Half the height, and the caps labels alone carry the
    structure.
  */
  .trakt-summary-details-grid-content {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-16) var(--gap-m);

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
      gap: var(--ni-12);
    }
  }
</style>
