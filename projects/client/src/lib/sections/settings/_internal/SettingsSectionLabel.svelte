<script lang="ts">
  const { title }: { title: string } = $props();
</script>

<p class="settings-section-label">{title}</p>

<style lang="scss">
  .settings-section-label {
    max-width: 600px;
    padding: var(--gap-m) var(--gap-m) var(--gap-xs);
    font-size: var(--font-size-title);
    font-weight: 600;
    color: var(--color-foreground);
    user-select: none;
  }
</style>
