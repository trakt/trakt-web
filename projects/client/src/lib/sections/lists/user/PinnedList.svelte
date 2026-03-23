<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import UserList from "./UserList.svelte";
  import { usePinnedListDismissal } from "./_internal/usePinnedListDismissal.ts";
  import { useUserListSummary } from "./useUserListSummary.ts";

  type PinnedListProps = {
    userId: string;
    listId: string;
    mode?: DiscoverMode;
  };

  const { userId, listId, mode = "media" }: PinnedListProps = $props();

  const { list, isLoading } = $derived(
    useUserListSummary({
      userId,
      listId,
    }),
  );

  const { dismiss, isDismissed } = $derived(
    usePinnedListDismissal(userId, listId),
  );
</script>

{#if !$isLoading && $list && !$isDismissed}
  <div class="trakt-pinned-list">
    <UserList list={$list} type={mode} />
    <div class="trakt-pinned-list-dismiss">
      <ActionButton
        onclick={dismiss}
        label={m.button_label_dismiss()}
        size="small"
        style="ghost"
      >
        <CloseIcon />
      </ActionButton>
    </div>
  </div>
{/if}

<style>
  .trakt-pinned-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
    position: relative;
  }

  .trakt-pinned-list-dismiss {
    position: absolute;
    top: 0;
    right: 0;
  }
</style>
