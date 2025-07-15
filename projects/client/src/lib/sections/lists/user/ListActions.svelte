<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary";
  import RenameListButton from "./_internal/RenameListButton.svelte";

  const { list }: { list: MediaListSummary } = $props();

  const { user } = useUser();
  const isListOwner = $derived($user.slug === list.user?.slug);
</script>

<RenderFor audience="authenticated">
  {#if isListOwner}
    <RenameListButton {list} />
  {/if}
</RenderFor>
