<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import { COMMENTS_DRILL_SIZE } from "$lib/utils/constants";
  import { writable } from "svelte/store";
  import type { CommentsProps } from "../../CommentsProps";
  import type { ActiveComment } from "../models/ActiveComment";
  import { useComments } from "../useComments";
  import CommentThreadCard from "./CommentThreadCard.svelte";
  import { THREAD_LIST_CLASS } from "./constants";
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
</script>

<Drawer
  {onClose}
  title={m.dialog_title_comment()}
  size="large"
  metaInfo={$sortType.text()}
  onOpened={() => isOpened.set(true)}
>
  {#if $isOpened}
    <div class={THREAD_LIST_CLASS}>
      <PaginatedList
        type={`comments-${$sortType.value}`}
        target="parent"
        useList={() =>
          useComments({
            slug: media.slug,
            limit: COMMENTS_DRILL_SIZE,
            sort: $sortType.value,
            ...props,
          })}
      >
        {#snippet items(items)}
          {#each items as comment (comment.id)}
            <CommentThreadCard
              {comment}
              {media}
              {reset}
              {setReplying}
              type={props.type}
              isReplying={isReplying(comment.id)}
              shouldScrollIntoView={comment.id === source?.id}
            />
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
    position: relative;

    :global(.trakt-paginated-list) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }
  }
</style>
