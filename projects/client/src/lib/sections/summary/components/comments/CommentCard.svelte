<script lang="ts">
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { Snippet } from "svelte";
  import TextCard from "../../../components/text-card/TextCard.svelte";
  import ReactAction from "./_internal/comment-actions/ReactAction.svelte";
  import ViewRepliesAction from "./_internal/comment-actions/ViewRepliesAction.svelte";
  import CommentBody from "./_internal/CommentBody.svelte";
  import CommentFooter from "./_internal/CommentFooter.svelte";
  import CommentHeader from "./_internal/CommentHeader.svelte";
  import type { ActiveComment } from "./_internal/models/ActiveComment";
  import type { CommentsProps } from "./CommentsProps";

  type CommentCardProps = {
    comment: MediaComment;
    onDrilldown: (comment: ActiveComment) => void;
    header?: Snippet;
  } & CommentsProps;

  const {
    comment,
    onDrilldown,
    media,
    header: externalHeader,
    ...typeProps
  }: CommentCardProps = $props();
</script>

<TextCard
  --width-card="var(--width-comment-card)"
  --height-card="var(--height-comment-card)"
>
  {#snippet header()}
    {#if externalHeader}
      {@render externalHeader()}
    {:else}
      <CommentHeader {comment} {media} {...typeProps} />
    {/if}
  {/snippet}

  <CommentBody
    {comment}
    {media}
    type="preview"
    onClick={() => onDrilldown?.({ id: comment.id, isReplying: false })}
  />

  {#snippet footer()}
    <CommentFooter>
      <ReactAction {comment} />
      <ViewRepliesAction {comment} {onDrilldown} />
    </CommentFooter>
  {/snippet}
</TextCard>
