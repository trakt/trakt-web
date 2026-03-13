<script lang="ts">
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import TextCard from "../../_internal/TextCard.svelte";
  import ReactAction from "./comment-actions/ReactAction.svelte";
  import ViewRepliesAction from "./comment-actions/ViewRepliesAction.svelte";
  import CommentBody from "./CommentBody.svelte";
  import CommentFooter from "./CommentFooter.svelte";
  import CommentHeader from "./CommentHeader.svelte";
  import type { ActiveComment } from "./models/ActiveComment";

  type CommentProps = {
    media: MediaEntry;
    comment: MediaComment;
    onDrilldown: (comment: ActiveComment) => void;
    type: ExtendedMediaType;
  };

  const { comment, media, onDrilldown, type }: CommentProps = $props();
</script>

<TextCard
  --width-card="var(--width-comment-card)"
  --height-card="var(--height-comment-card)"
>
  {#snippet header()}
    <CommentHeader {comment} {type} />
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
