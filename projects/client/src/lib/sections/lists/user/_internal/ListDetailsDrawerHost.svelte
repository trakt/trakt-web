<script lang="ts">
  import { page } from "$app/state";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import ListDetailsDrawer from "./ListDetailsDrawer.svelte";
  import {
    UserListDrawers,
    userListDrawerNavigation,
  } from "./userListDrawerNavigation.ts";

  const { list }: { list: MediaListSummary } = $props();

  const { drawer, close } = $derived(
    userListDrawerNavigation(page.url.searchParams),
  );
</script>

{#if drawer === UserListDrawers.Details}
  <ListDetailsDrawer {list} onClose={close} />
{/if}
