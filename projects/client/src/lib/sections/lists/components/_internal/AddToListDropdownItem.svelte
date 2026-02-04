<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ListAction from "$lib/sections/components/lists-drawer/ListAction.svelte";
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";

  const { media, onClick }: { media: MediaEntry; onClick: () => void } =
    $props();

  const { lists, isLoading } = useAllPersonalLists();
  const hasLists = $derived($lists.length > 0);
</script>

{#if hasLists}
  <ListAction style="dropdown-item" {onClick} {media} title={media.title}>
    {#snippet icon()}
      {#if $isLoading}
        <LoadingIndicator />
      {:else}
        <ListIcon />
      {/if}
    {/snippet}
  </ListAction>
{/if}
