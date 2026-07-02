<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CommentableMediaType } from "$lib/requests/models/CommentableMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import DeleteCommentButton from "./_internal/comment-actions/DeleteCommentButton.svelte";
  import EditCommentButton from "./_internal/comment-actions/EditCommentButton.svelte";
  import ReportCommentButton from "./_internal/comment-actions/ReportCommentButton.svelte";

  type CommentActionsProps = {
    comment: MediaComment;
    type: CommentableMediaType;
    isOwnComment: boolean;
    onEdit: () => void;
  };

  const { comment, type, isOwnComment, onEdit }: CommentActionsProps = $props();
</script>

<PopupMenu
  label={m.button_label_popup_menu({ title: m.list_title_comments() })}
  mode="standalone"
  title={m.list_title_comments()}
>
  {#snippet items()}
    {#if isOwnComment}
      <EditCommentButton onclick={onEdit} />
      <DeleteCommentButton {comment} {type} />
    {:else}
      <ReportCommentButton {comment} />
    {/if}
  {/snippet}
</PopupMenu>
