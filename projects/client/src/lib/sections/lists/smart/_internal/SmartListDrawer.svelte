<script lang="ts">
  import { page } from "$app/state";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery.ts";
  import SmartListRecipeDrawer from "./SmartListRecipeDrawer.svelte";
  import {
    SmartListDrawers,
    smartListDrawerNavigation,
  } from "./smartListDrawerNavigation.ts";

  const { list }: { list: SmartList } = $props();

  const { drawer, close } = $derived(
    smartListDrawerNavigation(page.url.searchParams),
  );
</script>

{#if drawer === SmartListDrawers.Recipe}
  <SmartListRecipeDrawer {list} onClose={close} />
{/if}
