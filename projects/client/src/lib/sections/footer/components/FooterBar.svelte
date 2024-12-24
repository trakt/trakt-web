<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-footer-bar">
  {@render children?.()}
</div>

<style lang="scss">
  @use "$style/mixins/index" as *;

  .trakt-footer-bar {
    padding: var(--ni-40);
    display: flex;
    justify-content: space-between;
    align-items: center;

    @include for-tablet-sm-and-below {
      padding: var(--ni-12) var(--ni-16);
    }
  }
</style>
