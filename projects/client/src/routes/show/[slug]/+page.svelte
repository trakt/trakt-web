<script lang="ts">
  import { page } from "$app/stores";
  import ShowSummary from "$lib/sections/summary/ShowSummary.svelte";
  import { useShow } from "./useShow";

  const { show, ratings } = $derived(useShow($page.params.slug));
</script>

{#if $show != null && $ratings != null}
  <ShowSummary media={$show} ratings={$ratings} />
{/if}
