<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-tag">
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-tag {
    @include tag-box;

    display: flex;
    align-items: center;

    height: var(--ni-12);
    margin: 0;

    border-radius: var(--border-radius-tag, var(--border-radius-pill));
  }
</style>
