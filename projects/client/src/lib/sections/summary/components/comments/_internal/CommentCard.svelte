<script lang="ts">
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import TextCard from "../../_internal/TextCard.svelte";
  import type { CommentsProps } from "../CommentsProps";
  import ReactAction from "./comment-actions/ReactAction.svelte";
  import ViewRepliesAction from "./comment-actions/ViewRepliesAction.svelte";
  import CommentBody from "./CommentBody.svelte";
  import CommentFooter from "./CommentFooter.svelte";
  import CommentHeader from "./CommentHeader.svelte";
  import type { ActiveComment } from "./models/ActiveComment";

  type CommentCardProps = {
    comment: MediaComment;
    onDrilldown: (comment: ActiveComment) => void;
  } & CommentsProps;

  const { comment, onDrilldown, media, ...typeProps }: CommentCardProps =
    $props();
</script>

<TextCard
  --width-card="var(--width-comment-card)"
  --height-card="var(--height-comment-card)"
>
  {#snippet header()}
    <CommentHeader {comment} {media} {...typeProps} />
  {/snippet}

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

  {#snippet footer()}
    <CommentFooter>
      <ReactAction {comment} />
      <ViewRepliesAction {comment} {onDrilldown} />
    </CommentFooter>
  {/snippet}
</TextCard>
