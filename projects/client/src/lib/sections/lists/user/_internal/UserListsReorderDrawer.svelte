<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { reorderUserListsRequest } from "$lib/requests/queries/users/reorderUserListsRequest.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import type { ReorderableListItem } from "./models/ReorderableListItem.ts";
  import ReorderDrawer from "./ReorderDrawer.svelte";
  import { listItemRankIds } from "./reorderListItems.ts";
  import { useReorderUserLists } from "./useReorderUserLists.ts";

  const {
    slug,
    title,
    onClose,
  }: {
    slug: string;
    title: string;
    onClose: () => void;
  } = $props();

  const { list, isLoading } = $derived(useReorderUserLists(slug));
  const { invalidateAll } = useInvalidator();

  async function requestReorder(items: ReorderableListItem[]) {
    return reorderUserListsRequest({
      userId: slug,
      rank: listItemRankIds(items),
    });
  }

  async function refreshReorderedLists() {
    await invalidateAll([InvalidateAction.List.Edited]);
  }
</script>

<ReorderDrawer
  {title}
  items={$list ?? []}
  isLoading={$isLoading}
  onApply={requestReorder}
  onApplied={refreshReorderedLists}
  posterAlt={(item) => m.image_alt_list_preview_poster({ title: item.title })}
  {onClose}
/>
