<script lang="ts">
  import { page } from "$app/state";
  import Error404Page from "$lib/pages/errors/Error404Page.svelte";
  import ErrorStatusPage from "$lib/pages/errors/ErrorStatusPage.svelte";
</script>

{#if page.status === 404}
  <Error404Page />
{/if}

{#if page.status !== 404}
  <ErrorStatusPage message={page.error?.message} />
{/if}
