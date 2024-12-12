<script lang="ts">
  type TraktPageProps = { title: string | undefined };
  const { children, title }: ChildrenProps & TraktPageProps = $props();
</script>

<svelte:head>
  {#if title != null}
    <title>Trakt Lite: {title}</title>
  {:else}
    <title>Trakt Lite</title>
  {/if}
</svelte:head>

<div class="trakt-content">
  {@render children()}
</div>

<style>
  .trakt-content {
    display: flex;
    flex-direction: column;
    gap: var(--ni-48);

    &:first-child {
      margin-top: var(--ni-48);
    }

    inset: 0;
    margin: auto;
  }
</style>
