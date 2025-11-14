<script lang="ts">
  const { text }: { text: string } = $props();
</script>

<p class="meta-info ellipsis">{text}</p>

<style>
  p.meta-info {
    color: var(--list-meta-info-color);
  }
</style>
