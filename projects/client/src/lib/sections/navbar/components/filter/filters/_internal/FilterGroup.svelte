<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-filter-group">
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-filter-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--gap-l);

    @include for-tablet-sm-and-below {
      gap: var(--gap-s);
    }
  }
</style>
