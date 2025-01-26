<script lang="ts">
  type PageErrorProps = {
    title: string;
    message: string;
  } & Partial<ChildrenProps>;

  const { title, message, children }: PageErrorProps = $props();
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main class="error-page">
  <h1>{title}</h1>
  <p>{message}</p>
  {#if children != null}
    {@render children()}
  {/if}
</main>

<style>
  .error-page {
    height: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-l);
  }
</style>
