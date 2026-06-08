<script lang="ts">
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { COMMENTS_DRILL_SIZE } from "$lib/utils/constants";
  import type { CommentsProps } from "./CommentsProps";
  import { useComments } from "./_internal/useComments";
  import { useActiveComment } from "./drawers/useActiveComment";
  import CommentThreadCard from "./drawers/CommentThreadCard.svelte";
  import { THREAD_LIST_CLASS } from "./drawers/constants";

  const { media, ...props }: CommentsProps = $props();

  const { current: sortType, set, options } = useToggler("comment");

  const { reset, setReplying, activeComment } = $derived(useActiveComment());

  const isReplying = (id: number) =>
    $activeComment?.id === id && $activeComment?.isReplying;
</script>

<div class="inline-comments">
  <div class="inline-comments-header">
    <Toggler value={$sortType.value} onChange={set} {options} />
  </div>

  <div class={THREAD_LIST_CLASS}>
    <PaginatedList
      type={`inline-comments-${$sortType.value}`}
      target="default"
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
            {...props}
            isReplying={isReplying(comment.id)}
            shouldScrollIntoView={false}
          />
        {/each}
      {/snippet}
    </PaginatedList>
  </div>
</div>

<style>
  .inline-comments {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .inline-comments-header {
    display: flex;
    justify-content: flex-end;
  }

  .trakt-comment-threads-list {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    :global(.trakt-paginated-list) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }
  }
</style>
