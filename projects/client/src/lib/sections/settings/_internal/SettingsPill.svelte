<script lang="ts">
  import TextTag from "$lib/components/tags/TextTag.svelte";

  const { label }: { label: string } = $props();
</script>

<TextTag classList="trakt-settings-pill">
  <p class="bold">{label}</p>
</TextTag>

<style lang="scss">
  :global(.trakt-settings-pill) {
    flex-shrink: 0;

    padding: var(--ni-2) var(--ni-8);
    border-radius: var(--border-radius-xl);

    background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }
</style>
