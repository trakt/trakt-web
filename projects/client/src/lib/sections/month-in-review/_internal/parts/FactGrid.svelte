<script lang="ts">
  const { columns = 4, children }: ChildrenProps & { columns?: 4 | 6 } =
    $props();
</script>

<div class="trakt-month-review-fact-grid" data-columns={columns}>
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-review-fact-grid {
    display: grid;
    grid-template-columns: repeat(var(--columns), auto);
    justify-content: space-between;
    gap: var(--gap-l) var(--gap-xl);
    padding-block: var(--gap-m);

    &[data-columns="4"] {
      --columns: 4;
    }

    &[data-columns="6"] {
      --columns: 6;

      @include for-tablet-sm-and-below {
        --columns: 3;
      }
    }

    @include for-mobile {
      --columns: 2;

      grid-template-columns: repeat(var(--columns), minmax(0, 1fr));

      &[data-columns] {
        --columns: 2;
      }
    }
  }
</style>
