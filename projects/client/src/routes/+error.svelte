<script lang="ts">
  import { page } from "$app/state";
  import Error404Page from "$lib/pages/errors/Error404Page.svelte";
  import ErrorPage from "$lib/pages/errors/ErrorPage.svelte";
</script>

<svelte:head>
  <title>{page.status === 404 ? "Page Not Found" : "Error"}</title>
</svelte:head>

{#if page.status === 404}
  <Error404Page />
{/if}

{#if page.status !== 404}
  <ErrorPage
    title="Error"
    message={page.error?.message ?? "An error occurred"}
  />
{/if}
