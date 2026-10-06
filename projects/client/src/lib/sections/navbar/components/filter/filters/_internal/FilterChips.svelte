<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-filter-chips">
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-filter-chips {
    display: contents;

    @include for-mobile {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xs);
      padding-block: var(--gap-xxs);
    }
  }
</style>
