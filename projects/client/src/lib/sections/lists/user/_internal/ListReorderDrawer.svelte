<script lang="ts">
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { reorderListRequest } from "$lib/requests/queries/users/reorderListRequest.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { assertDefined } from "$lib/utils/assert/assertDefined.ts";
  import type { ReorderListSource } from "../models/ReorderListSource.ts";
  import type { ReorderableListItem } from "./models/ReorderableListItem.ts";
  import ReorderDrawer from "./ReorderDrawer.svelte";
  import { listItemRankIds } from "./reorderListItems.ts";
  import { useReorderList } from "./useReorderList.ts";

  const {
    source,
    title,
    onClose,
  }: {
    source: ReorderListSource;
    title: string;
    onClose: () => void;
  } = $props();

  const { list, isLoading } = $derived(useReorderList(source));
  const { invalidateAll } = useInvalidator();

  async function requestReorder(items: ReorderableListItem[]) {
    return reorderListRequest({
      userId: assertDefined(
        source.list.user.slug,
        "Expected user list to have a user slug",
      ),
      listId: source.list.id,
      rank: listItemRankIds(items),
    });
  }

  async function refreshReorderedItems() {
    await invalidateAll([
      InvalidateAction.Listed("movie"),
      InvalidateAction.Listed("show"),
    ]);
  }
</script>

<ReorderDrawer
  {title}
  items={$list ?? []}
  isLoading={$isLoading}
  onApply={requestReorder}
  onApplied={refreshReorderedItems}
  {onClose}
/>
