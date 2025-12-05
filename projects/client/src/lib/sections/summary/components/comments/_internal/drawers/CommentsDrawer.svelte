<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "svelte/store";
  import type { CommentsProps } from "../../CommentsProps";
  import type { ActiveComment } from "../models/ActiveComment";
  import { useComments } from "../useComments";
  import CommentThreadCard from "./CommentThreadCard.svelte";
  import { scrollActiveCommentIntoView } from "./scrollActiveCommentIntoView";
  import { useActiveComment } from "./useActiveComment";

  type CommentsDrawerProps = {
    source?: ActiveComment;
    onClose: () => void;
  } & CommentsProps;

  const { onClose, source, media, ...props }: CommentsDrawerProps = $props();

  const { current: sortType, set, options } = useToggler("comment");

  const { reset, setReplying, activeComment } = $derived(
    useActiveComment(source),
  );
  const isReplying = (id: number) =>
    $activeComment?.id === id && $activeComment?.isReplying;

  const isOpened = writable(false);
  const hasScrolled = writable(false);

  const shouldScrollIntoView = $derived((id: number) => {
    const isMatch = id === source?.id;
    if ($hasScrolled || !isMatch) {
      return false;
    }

    hasScrolled.set(true);
    return isMatch;
  });

  // TODO paginate on trakt-comment-treads-list scroll
</script>

<Drawer
  {onClose}
  title={m.dialog_title_comment()}
  size="large"
  metaInfo={$sortType.text()}
  onOpened={() => isOpened.set(true)}
>
  {#if $isOpened}
    <div class="trakt-comment-threads-list">
      <PaginatedList
        type="comment"
        id={`view-all-comments-${media.slug}-${$sortType.value}`}
        target="parent"
        useList={(params) =>
          useComments({
            slug: media.slug,
            // TODO constant
            limit: 25,
            sort: $sortType.value,
            page: params.page,
            ...props,
          })}
      >
        {#snippet items(items)}
          {#each items as comment (comment.id)}
            <div
              class="trakt-comment-thread"
              use:scrollActiveCommentIntoView={shouldScrollIntoView(comment.id)}
            >
              <CommentThreadCard
                {comment}
                {media}
                {reset}
                {setReplying}
                type={props.type}
                isReplying={isReplying(comment.id)}
              />
            </div>
          {/each}
        {/snippet}
      </PaginatedList>
    </div>
  {/if}

  {#snippet badge()}
    <Toggler value={$sortType.value} onChange={set} {options} />
  {/snippet}
</Drawer>

<style>
  .trakt-comment-threads-list {
    overflow-y: auto;
    overscroll-behavior: contain;

    :global(.trakt-paginated-list) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }
  }
</style>
