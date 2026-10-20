<script lang="ts">
  import { goto } from "$app/navigation";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import type { Snippet } from "svelte";
  import TextCard from "$lib/sections/components/text-card/TextCard.svelte";
  import ReactAction from "./_internal/comment-actions/ReactAction.svelte";
  import ViewRepliesAction from "./_internal/comment-actions/ViewRepliesAction.svelte";
  import CommentBody from "./_internal/CommentBody.svelte";
  import CommentFooter from "./_internal/CommentFooter.svelte";
  import CommentHeader from "./_internal/CommentHeader.svelte";
  import { isTopLevelComment } from "./_internal/isTopLevelComment.ts";
  import OwnCommentLabel from "./_internal/OwnCommentLabel.svelte";
  import ReplyContext from "./_internal/ReplyContext.svelte";
  import { toReplyThreadUrl } from "./_internal/toReplyThreadUrl.ts";
  import { useOwnCommentHighlight } from "./_internal/useOwnCommentHighlight.ts";
  import type { ActiveComment } from "./_internal/models/ActiveComment";
  import type { CommentsProps } from "./CommentsProps";

  type CommentCardProps = {
    comment: MediaComment;
    onDrilldown: (comment: ActiveComment) => void;
    header?: Snippet;
    highlightOwn?: boolean;
  } & CommentsProps;

  const {
    comment,
    onDrilldown,
    media,
    header: externalHeader,
    highlightOwn = false,
    ...typeProps
  }: CommentCardProps = $props();

  const isReply = $derived(!isTopLevelComment(comment));

  const { highlightedUserId } = useOwnCommentHighlight();
  const isHighlighted = $derived(
    highlightOwn && comment.user.id === $highlightedUserId,
  );
  const threadUrl = $derived(
    toReplyThreadUrl({ parentId: comment.parentId, media, ...typeProps }),
  );

  const onBodyClick = () => {
    if (!isReply) {
      onDrilldown({ id: comment.id, isReplying: false });
      return;
    }
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(threadUrl);
  };
</script>

<TextCard
  --width-card="var(--width-comment-card)"
  --height-card="var(--height-comment-card)"
  variant={isHighlighted ? "tinted" : "opaque"}
>
  {#snippet header()}
    {#if isHighlighted}
      <OwnCommentLabel />
    {/if}
    {#if externalHeader}
      {@render externalHeader()}
    {:else}
      {#if isReply}
        <ReplyContext href={threadUrl} />
      {/if}
      <CommentHeader {comment} {media} {...typeProps} />
    {/if}
  {/snippet}

  <CommentBody
    {comment}
    {media}
    type="preview"
    onClick={onBodyClick}
  />

  {#snippet footer()}
    <CommentFooter>
      <ReactAction {comment} />
      {#if !isReply}
        <ViewRepliesAction {comment} {onDrilldown} />
      {/if}
    </CommentFooter>
  {/snippet}
</TextCard>
