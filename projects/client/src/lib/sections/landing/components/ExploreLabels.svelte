<script lang="ts">
  const { text }: { text: string } = $props();
</script>

<div class="trakt-explore-labels">
  <span class="bold capitalize">explore</span>
  <span class="bold capitalize">{text}</span>
</div>

<style>
  .trakt-explore-labels {
    display: flex;
    flex-direction: column;
    color: var(--color-foreground);
  }
</style>
