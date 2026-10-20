<script lang="ts">
  const { text }: { text: string } = $props();
</script>

<p class="bold ellipsis">{text}</p>

<style>
  p {
    color: var(--list-meta-info-color);
  }
</style>
