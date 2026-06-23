<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";

  const {
    children,
    variant = "full",
  }: { variant?: "partial" | "full" } & ChildrenProps = $props();
</script>

<trakt-indicator-tag data-variant={variant}>
  <StemTag
    --color-background-stem-tag="var(--color-background-indicator-tag)"
    --color-foreground-stem-tag="var(--color-text-indicator-tag)"
    icon={children}
  />
</trakt-indicator-tag>

<style>
  trakt-indicator-tag {
    :global(.trakt-tag) {
      width: var(--ni-10);
      height: var(--ni-10);
      line-height: var(--ni-10);

      :global(trakt-tag-icon svg) {
        width: var(--ni-10);
        height: var(--ni-10);
      }
    }

    &[data-variant="partial"] {
      :global(.trakt-tag) {
        background: linear-gradient(
          to right,
          var(--color-background-stem-tag) 50%,
          var(--shade-500) 50%
        );
      }
    }
  }
</style>
