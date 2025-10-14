<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { useDeleteComment } from "./useDeleteComment";

  const { comment, type }: { comment: MediaComment; type: ExtendedMediaType } =
    $props();

  const { user } = useUser();
  const { confirm } = useConfirm();
  const { isDeleting, deleteComment } = $derived(
    useDeleteComment({ comment, type }),
  );

  const isOwnComment = $derived(comment.user.id === $user.id);
  const confirmDelete = $derived(
    confirm({
      type: ConfirmationType.DeleteComment,
      onConfirm: () => deleteComment(),
    }),
  );
</script>

<RenderFor audience="authenticated">
  {#if isOwnComment}
    <div class="trakt-delete-comment">
      <ActionButton
        onclick={confirmDelete}
        label={m.button_label_delete_comment()}
        style="ghost"
        size="small"
        disabled={$isDeleting}
      >
        <DeleteIcon />
      </ActionButton>
    </div>
  {/if}
</RenderFor>

<style>
  .trakt-delete-comment {
    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }
  }
</style>
