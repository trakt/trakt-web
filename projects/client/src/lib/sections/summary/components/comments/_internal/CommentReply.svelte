<script lang="ts">
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import type { CommentTypeProps } from "../CommentsProps";
  import ReactAction from "./comment-actions/ReactAction.svelte";
  import CommentBody from "./CommentBody.svelte";
  import CommentFooter from "./CommentFooter.svelte";
  import CommentHeader from "./CommentHeader.svelte";

  type CommentReplyProps = {
    media: MediaEntry;
    comment: MediaComment;
  } & CommentTypeProps;

  const { comment, media, ...typeProps }: CommentReplyProps = $props();
</script>

<CommentHeader {comment} {media} {...typeProps} />
<CommentBody {comment} {media} type="full" />
<CommentFooter>
  <ReactAction {comment} />
</CommentFooter>
