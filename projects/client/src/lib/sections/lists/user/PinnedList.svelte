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
  {#snippet dismissAction()}
    <ActionButton
      onclick={dismiss}
      label={m.button_label_dismiss()}
      style="ghost"
      color="default"
    >
      <CloseIcon />
    </ActionButton>
  {/snippet}

  <UserList list={$list} type={mode} titleAction={dismissAction} />
{/if}
