<script lang="ts">
  const { text }: { text: string } = $props();
</script>

<div class="trakt-explore-labels">
  <span class="meta-info capitalize">explore</span>
  <span class="meta-info capitalize">{text}</span>
</div>

<style>
  .trakt-explore-labels {
    display: flex;
    flex-direction: column;

    span.meta-info {
      font-size: var(--font-size-text);
      color: var(--color-foreground);
    }
  }
</style>
