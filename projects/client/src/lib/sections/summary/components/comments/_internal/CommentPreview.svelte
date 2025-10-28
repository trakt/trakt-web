<script lang="ts">
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ReactionsSummary from "./comment-actions/ReactionsSummary.svelte";
  import { useCommentReactions } from "./comment-actions/useCommentReactions.ts";
  import ViewRepliesAction from "./comment-actions/ViewRepliesAction.svelte";
  import CommentBody from "./CommentBody.svelte";
  import CommentFooter from "./CommentFooter.svelte";
  import CommentHeader from "./CommentHeader.svelte";
  import type { ActiveComment } from "./models/ActiveComment.ts";

  type CommentProps = {
    media: MediaEntry;
    comment: MediaComment;
    onDrilldown?: (comment: ActiveComment) => void;
    type: ExtendedMediaType;
  };

  const { comment, media, onDrilldown, type }: CommentProps = $props();
  const { summary } = $derived(useCommentReactions({ id: comment.id }));
</script>

<CommentHeader {comment} {type} />
<CommentBody
  {comment}
  {media}
  type="preview"
  onClick={() =>
    onDrilldown?.({
      id: comment.id,
      isReplying: false,
    })}
/>
<CommentFooter>
  <ReactionsSummary summary={$summary} />

  {#if onDrilldown}
    <ViewRepliesAction {comment} {onDrilldown} />
  {/if}
</CommentFooter>
