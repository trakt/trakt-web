<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="trakt-settings-group-card">
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-group-card {
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    overflow: hidden;
    max-width: var(--ni-640);

    box-shadow: var(--shadow-base);

    > :global(* + *) {
      border-top: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }

    @include for-tablet-sm-and-below() {
      max-width: 100%;
    }
  }
</style>
