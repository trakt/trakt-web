<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";

  const { children }: ChildrenProps = $props();
</script>

<trakt-indicator-tag>
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
  }
</style>
