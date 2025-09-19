<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ViewAllButton from "$lib/sections/lists/components/ViewAllButton.svelte";
  import CommentCard from "$lib/sections/summary/components/comments/_internal/CommentCard.svelte";
  import { writable } from "svelte/store";
  import AddCommentAction from "./_internal/comment-actions/AddCommentAction.svelte";
  import CommentsDialog from "./_internal/dialog/CommentsDialog.svelte";
  import PostCommentDialog from "./_internal/dialog/PostCommentDialog.svelte";
  import type { ActiveComment } from "./_internal/models/ActiveComment";
  import { useComments } from "./_internal/useComments";
  import type { CommentsProps } from "./CommentsProps";

  const { media, ...props }: CommentsProps = $props();

  const { isLoading, comments } = $derived(
    useComments({
      slug: media.slug,
      ...props,
    }),
  );

  const dialog = writable<HTMLDialogElement>();
  const postCommentDialog = writable<HTMLDialogElement>();
  const drilldownSource = writable<ActiveComment | undefined>(undefined);

  const onDrilldown = (comment?: ActiveComment) => {
    $dialog.showModal();
    drilldownSource.set(comment);
  };
</script>

<RenderFor audience="all" navigation="default">
  <SectionList
    id={`comments-list-${media.slug}`}
    items={$comments}
    title={m.list_title_comments()}
    --height-list="var(--height-comments-list)"
  >
    {#snippet item(comment)}
      <CommentCard {comment} {media} {onDrilldown} />
    {/snippet}

    {#snippet empty()}
      {#if !$isLoading}
        <p class="small">{m.list_placeholder_comments()}</p>
      {/if}
    {/snippet}

    {#snippet dynamicActions()}
      <AddCommentAction
        onclick={() => {
          $postCommentDialog.showModal();
        }}
      />
    {/snippet}

    {#snippet actions()}
      <ViewAllButton
        label={m.button_label_view_all_comments()}
        onclick={() => onDrilldown()}
        source={{ id: "comments" }}
      />
    {/snippet}
  </SectionList>

  <PostCommentDialog
    dialog={postCommentDialog}
    onCommentPost={onDrilldown}
    {media}
    {...props}
  />
  <CommentsDialog source={$drilldownSource} {dialog} {media} {...props} />
</RenderFor>
