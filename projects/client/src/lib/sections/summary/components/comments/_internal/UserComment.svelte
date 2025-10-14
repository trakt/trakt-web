<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ReactAction from "./comment-actions/ReactAction.svelte";
  import ReplyButton from "./comment-actions/ReplyButton.svelte";
  import ViewRepliesAction from "./comment-actions/ViewRepliesAction.svelte";
  import CommentBody from "./CommentBody.svelte";
  import CommentFooter from "./CommentFooter.svelte";
  import CommentHeader from "./CommentHeader.svelte";
  import type { ActiveComment } from "./models/ActiveComment";

  type CommentProps = {
    media: MediaEntry;
    comment: MediaComment;
    onDrilldown?: (comment: ActiveComment) => void;
    type: ExtendedMediaType;
  };

  const { comment, media, onDrilldown, type }: CommentProps = $props();
</script>

<CommentHeader {comment} {type} />
<CommentBody {comment} {media} />
<CommentFooter>
  <ReactAction {comment} />

  {#if onDrilldown}
    <ViewRepliesAction {comment} {onDrilldown} />
    <RenderFor audience="authenticated">
      <ReplyButton {comment} onClick={onDrilldown} />
    </RenderFor>
  {/if}
</CommentFooter>
