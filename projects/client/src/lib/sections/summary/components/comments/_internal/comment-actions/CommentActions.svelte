<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import DeleteCommentButton from "./DeleteCommentButton.svelte";
  import EditCommentButton from "./EditCommentButton.svelte";

  type CommentActionsProps = {
    comment: MediaComment;
    type: ExtendedMediaType;
    onEdit: () => void;
  };

  const { comment, type, onEdit }: CommentActionsProps = $props();
</script>

<PopupMenu
  label={m.button_label_popup_menu({ title: m.list_title_comments() })}
  mode="standalone"
>
  {#snippet items()}
    <EditCommentButton onclick={onEdit} />
    <DeleteCommentButton {comment} {type} />
  {/snippet}
</PopupMenu>
