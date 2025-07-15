<script lang="ts">
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import DeleteListButton from "./_internal/DeleteListButton.svelte";
  import RenameListButton from "./_internal/RenameListButton.svelte";
  import { useDeleteList } from "./_internal/useDeleteList";

  const {
    list,
    variant = "compact",
  }: { list: MediaListSummary; variant?: "compact" | "all" } = $props();

  const { deleteList, isDeleting, isDeleted } = $derived(useDeleteList(list));

  const { user } = useUser();
  const isListOwner = $derived($user.slug === list.user?.slug);
</script>

<RenderFor audience="authenticated">
  {#if $isDeleted}
    <Redirect to={UrlBuilder.lists.user()} />
  {/if}

  {#if isListOwner}
    <RenameListButton {list} isDeleting={$isDeleting} />

    {#if variant === "all"}
      <DeleteListButton {list} isDeleting={$isDeleting} onDelete={deleteList} />
    {/if}
  {/if}
</RenderFor>
