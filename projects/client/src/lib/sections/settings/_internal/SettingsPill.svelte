<script lang="ts">
  import TextTag from "$lib/components/tags/TextTag.svelte";

  const { label }: { label: string } = $props();
</script>

<TextTag classList="trakt-settings-pill">
  <p class="bold">{label}</p>
</TextTag>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-settings-pill) {
    flex-shrink: 0;

    @include tag-box;

    background: color-mix(in srgb, var(--color-foreground) 10%, transparent);
  }
</style>
