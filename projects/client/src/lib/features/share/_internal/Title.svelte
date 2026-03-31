<svelte:options css="injected" />

<script lang="ts">
  const { title }: { title: string } = $props();
</script>

<h1 class="trakt-share-title">{title}</h1>

<style>
  .trakt-share-title {
    margin: 0;

    font-size: 48px;
    line-height: 52px;
  }
</style>
