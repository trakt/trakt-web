<script lang="ts">
  import Dialog from "$lib/components/dialogs/Dialog.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { CommentsProps } from "$lib/sections/summary/components/comments/CommentsProps";
  import { writable, type Writable } from "svelte/store";
  import type { ActiveComment } from "../models/ActiveComment";
  import { useComments } from "../useComments";
  import CommentList from "./CommentList.svelte";
  import CommentThreadCard from "./CommentThreadCard.svelte";
  import { scrollActiveCommentIntoView } from "./scrollActiveCommentIntoView";
  import { useActiveComment } from "./useActiveComment";

  type CommentsDialogProps = {
    dialog: Writable<HTMLDialogElement>;
    source?: ActiveComment;
  } & CommentsProps;

  const {
    dialog = writable(),
    source,
    media,
    ...props
  }: CommentsDialogProps = $props();

  const { current: sortType, set, options } = useToggler("comment");

  // FIXME: paginate instead of getting all
  const { comments } = $derived(
    useComments({
      slug: media.slug,
      limit: "all",
      sort: $sortType.value,
      ...props,
    }),
  );

  const { reset, setReplying, activeComment } = $derived(
    useActiveComment(source),
  );
  const isReplying = (id: number) =>
    $activeComment?.id === id && $activeComment?.isReplying;
</script>

<Dialog
  title={m.dialog_title_comments()}
  {dialog}
  onClose={reset}
  metaInfo={$sortType.text}
>
  <div class="trakt-comment-threads">
    <CommentList
      id={`comment-threads-list-${media.slug}-${$sortType.value}`}
      items={$comments}
      title=""
      --height-list="min(var(--height-comment-thread-list), calc(0.7 * var(--dialog-height)))"
    >
      {#snippet item(comment)}
        <comment-thread
          use:scrollActiveCommentIntoView={comment.id === source?.id}
        >
          <CommentThreadCard
            {comment}
            {media}
            {reset}
            {setReplying}
            type={props.type}
            isReplying={isReplying(comment.id)}
          />
        </comment-thread>
      {/snippet}
    </CommentList>
  </div>

  {#snippet badge()}
    <Toggler value={$sortType.value} onChange={set} {options} />
  {/snippet}
</Dialog>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-threads {
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;

    @include for-mobile {
      :global(.trakt-list-header) {
        display: none;
      }
    }
  }
</style>
