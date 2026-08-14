<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-settings-row-control">
  {@render children()}
</div>

<style lang="scss">
  .trakt-settings-row-control {
    flex-shrink: 0;
    display: flex;
    justify-content: end;

    width: var(--ni-148);

    :global(.trakt-select-trigger),
    :global(.trakt-button) {
      width: 100%;
      box-sizing: border-box;
    }

    :global(.trakt-button) {
      --button-height: var(--ni-40);
      padding: var(--ni-12);
    }
  }
</style>
