<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import LoadingIndicator from "$lib/sections/lists/drilldown/_internal/LoadingIndicator.svelte";
  import { writable } from "svelte/store";
  import type { CommentsProps } from "../../CommentsProps";
  import type { ActiveComment } from "../models/ActiveComment";
  import { useComments } from "../useComments";
  import VerticalList from "./_internal/VerticalList.svelte";
  import CommentThreadCard from "./CommentThreadCard.svelte";
  import { scrollActiveCommentIntoView } from "./scrollActiveCommentIntoView";
  import { useActiveComment } from "./useActiveComment";

  type CommentsDrawerProps = {
    source?: ActiveComment;
    onClose: () => void;
  } & CommentsProps;

  const { onClose, source, media, ...props }: CommentsDrawerProps = $props();

  const { current: sortType, set, options } = useToggler("comment");

  // FIXME: add support for pagination
  const { comments, isLoading } = $derived(
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
</script>

<Drawer
  {onClose}
  title={m.dialog_title_comment()}
  size="large"
  metaInfo={$sortType.text()}
  onOpened={() => isOpened.set(true)}
>
  {#if $isOpened}
    <VerticalList
      id={`comment-threads-list-${media.slug}-${$sortType.value}`}
      items={$comments}
    >
      {#snippet item(comment)}
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
      {/snippet}

      {#snippet empty()}
        {#if $isLoading}
          <LoadingIndicator />
        {/if}
      {/snippet}
    </VerticalList>
  {/if}

  {#snippet badge()}
    <Toggler value={$sortType.value} onChange={set} {options} />
  {/snippet}
</Drawer>
