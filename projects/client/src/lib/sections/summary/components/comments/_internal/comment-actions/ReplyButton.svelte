<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import ReplyIcon from "$lib/components/icons/ReplyIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { usePermissions } from "$lib/stores/usePermissions";
  import type { ActiveComment } from "../models/ActiveComment";

  type ReplyButtonProps = {
    comment: MediaComment;
    onClick: (comment: ActiveComment) => void;
  };

  const { comment, onClick }: ReplyButtonProps = $props();
  const { isPermitted } = usePermissions("comment");
</script>

<RenderFor audience="authenticated">
  <Button
    label={m.comment_reply_label({ user: comment.user.username })}
    onclick={() => {
      onClick({ id: comment.id, isReplying: true });
    }}
    style="ghost"
    color="purple"
    disabled={!$isPermitted}
  >
    {#snippet icon()}
      <ReplyIcon />
    {/snippet}
    {m.comment_reply()}
  </Button>
</RenderFor>
