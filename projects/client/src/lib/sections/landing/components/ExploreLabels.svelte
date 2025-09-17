<script lang="ts">
  const { text }: { text: string } = $props();
</script>

<div class="trakt-explore-labels">
  <span class="meta-info">explore</span>
  <span class="meta-info">{text}</span>
</div>

<style>
  .trakt-explore-labels {
    display: flex;
    flex-direction: column;

    span.meta-info {
      font-size: var(--ni-14);
      line-height: var(--ni-14);
      color: var(--color-foreground);
    }
  }
</style>
