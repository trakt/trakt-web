<script lang="ts">
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ReactAction from "./comment-actions/ReactAction.svelte";
  import CommentBody from "./CommentBody.svelte";
  import CommentFooter from "./CommentFooter.svelte";
  import CommentHeader from "./CommentHeader.svelte";

  type CommentProps = {
    media: MediaEntry;
    comment: MediaComment;
    type: ExtendedMediaType;
  };

  const { comment, media, type }: CommentProps = $props();
</script>

<CommentHeader {comment} {type} />
<CommentBody {comment} {media} type="full" />
<CommentFooter>
  <ReactAction {comment} />
</CommentFooter>
