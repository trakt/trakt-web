<script lang="ts">
  const { children }: ChildrenProps = $props();
</script>

<div class="settings-group-card">
  {@render children()}
</div>

<style lang="scss">
  .settings-group-card {
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    overflow: hidden;
    max-width: 600px;

    > :global(* + *) {
      border-top: var(--border-thickness-xxs) solid
        color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }
  }
</style>
