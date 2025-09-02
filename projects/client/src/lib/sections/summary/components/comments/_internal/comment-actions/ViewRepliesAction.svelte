<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CommentIcon from "$lib/components/icons/CommentIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import type { ActiveComment } from "../models/ActiveComment";

  type ViewRepliesActionProps = {
    comment: MediaComment;
    onDrilldown?: (comment: ActiveComment) => void;
  };

  const { comment, onDrilldown }: ViewRepliesActionProps = $props();

  const iconStyle = $derived(comment.replyCount > 0 ? "filled" : "open");
</script>

<Button
  label={m.button_label_comment_replies()}
  onclick={() => onDrilldown?.({ id: comment.id, isReplying: false })}
  style="ghost"
  color="purple"
  disabled={!onDrilldown}
>
  {#snippet icon()}
    <CommentIcon style={iconStyle} />
  {/snippet}

  {toHumanNumber(comment.replyCount, getLocale())}
</Button>
