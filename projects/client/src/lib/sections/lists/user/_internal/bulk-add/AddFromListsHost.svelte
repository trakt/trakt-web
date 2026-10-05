<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { type Snippet, untrack } from "svelte";
  import BulkAddDrawer from "./BulkAddDrawer.svelte";
  import { useIsCollaborationList } from "./useIsCollaborationList.ts";

  const {
    list,
    children,
  }: { list: MediaListSummary; children: Snippet<[() => void]> } = $props();

  const { user } = useUser();
  const { isCollaboration } = useIsCollaborationList({
    list$: fromRune(() => list),
    userSlug: untrack(() => $user.slug),
  });

  let showBulkAdd = $state(false);
</script>

{#if $isCollaboration}
  {@render children(() => (showBulkAdd = true))}
{/if}

{#if showBulkAdd}
  <BulkAddDrawer {list} onClose={() => (showBulkAdd = false)} />
{/if}
