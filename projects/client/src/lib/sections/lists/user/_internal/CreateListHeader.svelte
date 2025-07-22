<script>
  import CreateListAction from "./CreateListAction.svelte";
</script>

<div class="trakt-add-new-list-header">
  <CreateListAction />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-add-new-list-header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--gap-m);
    height: var(--ni-40);
    user-select: none;

    margin: 0 var(--layout-distance-side);
    transition: margin calc(var(--transition-increment) * 2) ease-in-out;

    @include for-mobile {
      :global(trakt-list-upsell-link) {
        width: 100%;
      }
    }
  }
</style>
