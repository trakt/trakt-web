<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment";

  type ViewRepliesActionProps = {
    comment: MediaComment;
    onDrilldown?: (id: number) => void;
  };

  const { comment, onDrilldown }: ViewRepliesActionProps = $props();

  const iconStyle = $derived(comment.replyCount > 0 ? "filled" : "open");
</script>

<Button
  label={m.comment_replies_label()}
  onclick={() => onDrilldown?.(comment.id)}
  style="ghost"
  color="purple"
  disabled={!onDrilldown}
>
  {#snippet icon()}
    <CommentIcon style={iconStyle} />
  {/snippet}
  {m.comment_replies_text({ count: comment.replyCount })}
</Button>
