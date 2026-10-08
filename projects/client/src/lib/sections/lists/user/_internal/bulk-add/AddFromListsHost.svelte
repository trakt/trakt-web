<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { type Snippet, untrack } from "svelte";
  import BulkAddDrawer from "./BulkAddDrawer.svelte";
  import { useCanAddFromLists } from "./useCanAddFromLists.ts";

  type AddFromListsHostProps = {
    list: MediaListSummary;
    isSharedOnly?: boolean;
    children: Snippet<[() => void]>;
  };

  const { list, isSharedOnly = false, children }: AddFromListsHostProps =
    $props();

  const { user } = useUser();
  const { canAddFromLists, isSharedList } = useCanAddFromLists({
    list$: fromRune(() => list),
    userSlug: untrack(() => $user.slug),
  });

  const isVisible = $derived(
    isSharedOnly ? $isSharedList : $canAddFromLists,
  );

  let showBulkAdd = $state(false);
</script>

{#if isVisible}
  {@render children(() => (showBulkAdd = true))}
{/if}

{#if showBulkAdd}
  <BulkAddDrawer {list} onClose={() => (showBulkAdd = false)} />
{/if}
