<script lang="ts">
  const { letter }: { letter: string } = $props();
</script>

<span class="trakt-letter-group-header">{letter}</span>

<style lang="scss">
  .trakt-letter-group-header {
    font-size: var(--ni-20);
    font-weight: bold;
    color: var(--color-text-primary);
    padding-block: var(--gap-xs);
    border-bottom: 1px solid var(--color-border);
  }
</style>
