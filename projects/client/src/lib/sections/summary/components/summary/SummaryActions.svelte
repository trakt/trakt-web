<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-summary-actions">
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-actions {
    display: flex;
    gap: var(--gap-m);
    justify-content: flex-end;
    flex-wrap: wrap;

    @include for-tablet-sm {
      display: grid;
    }

    @include for-mobile {
      flex-flow: column;
      padding: var(--ni-16);
    }
  }
</style>
