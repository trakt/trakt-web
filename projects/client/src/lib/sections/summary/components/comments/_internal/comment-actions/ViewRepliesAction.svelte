<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { ActiveComment } from "../models/ActiveComment";

  type ViewRepliesActionProps = {
    comment: MediaComment;
    onDrilldown?: (comment: ActiveComment) => void;
  };

  const { comment, onDrilldown }: ViewRepliesActionProps = $props();

  const iconStyle = $derived(comment.replyCount > 0 ? "filled" : "open");
</script>

<Button
  label={m.comment_replies_label()}
  onclick={() => onDrilldown?.({ id: comment.id, isReplying: false })}
  style="ghost"
  color="purple"
  disabled={!onDrilldown}
>
  {#snippet icon()}
    <CommentIcon style={iconStyle} />
  {/snippet}

  <RenderFor audience="all" device={["tablet-sm", "tablet-lg", "desktop"]}>
    {m.comment_replies_text({ count: comment.replyCount })}
  </RenderFor>

  <RenderFor audience="all" device={["mobile"]}>
    {comment.replyCount}
  </RenderFor>
</Button>
