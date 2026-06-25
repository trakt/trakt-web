<script lang="ts">
  import { InvalidateAction } from "$lib/requests/models/InvalidateAction.ts";
  import { reorderListRequest } from "$lib/requests/queries/users/reorderListRequest.ts";
  import { reorderWatchlistRequest } from "$lib/requests/queries/users/reorderWatchlistRequest.ts";
  import { useInvalidator } from "$lib/stores/useInvalidator.ts";
  import { assertDefined } from "$lib/utils/assert/assertDefined.ts";
  import type { ReorderListSource } from "./models/ReorderListSource.ts";
  import type { ReorderableListItem } from "./_internal/models/ReorderableListItem.ts";
  import ReorderDrawer from "./_internal/ReorderDrawer.svelte";
  import { listItemRankIds } from "./_internal/reorderListItems.ts";
  import { useReorderList } from "./_internal/useReorderList.ts";

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
    if (source.type === "watchlist") {
      return reorderWatchlistRequest({
        rank: listItemRankIds(items),
      });
    }

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
    const invalidations = source.type === "watchlist"
      ? [
        InvalidateAction.Watchlisted("movie"),
        InvalidateAction.Watchlisted("show"),
      ]
      : [
        InvalidateAction.Listed("movie"),
        InvalidateAction.Listed("show"),
      ];

    await invalidateAll(invalidations);
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
