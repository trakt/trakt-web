<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import ViewAllButton from "$lib/sections/lists/components/ViewAllButton.svelte";
  import CommentCard from "$lib/sections/summary/components/comments/_internal/CommentCard.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import AddCommentAction from "./_internal/comment-actions/AddCommentAction.svelte";
  import PostCommentDialog from "./_internal/dialog/PostCommentDialog.svelte";
  import CommentsDrawer from "./_internal/drawers/CommentsDrawer.svelte";
  import type { ActiveComment } from "./_internal/models/ActiveComment";
  import { useComments } from "./_internal/useComments";
  import type { CommentsProps } from "./CommentsProps";

  const { media, ...props }: CommentsProps = $props();

  const { current: sortType, set, options } = useToggler("comment");

  const { isLoading, comments } = $derived(
    useComments({
      slug: media.slug,
      sort: $sortType.value,
      ...props,
    }),
  );

  const postCommentDialog = writable<HTMLDialogElement | undefined>(undefined);
  const drilldownSource = writable<ActiveComment | undefined>(undefined);

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);

  const onDrilldown = (comment?: ActiveComment) => {
    isOpen.set(true);
    drilldownSource.set(comment);
  };
</script>

{#snippet metaInfo()}
  <ListMetaInfo text={$sortType.text()} />
{/snippet}

<RenderFor audience="all">
  <SectionList
    id={`comments-list-${media.slug}-${$sortType.value}`}
    items={$comments}
    title={m.list_title_comments()}
    --height-list="var(--height-comments-list)"
    {metaInfo}
  >
    {#snippet item(comment)}
      <CommentCard {comment} {media} {onDrilldown} type={props.type} />
    {/snippet}

    {#snippet empty()}
      {#if !$isLoading}
        <p>{m.list_placeholder_comments()}</p>
      {/if}
    {/snippet}

    {#snippet dynamicActions()}
      <AddCommentAction
        onclick={() => {
          $postCommentDialog?.showModal();
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

    {#snippet badge()}
      <Toggler value={$sortType.value} onChange={set} {options} />
    {/snippet}
  </SectionList>

  <PostCommentDialog
    dialog={postCommentDialog}
    onCommentPost={onDrilldown}
    {media}
    {...props}
  />

  {#if $isOpen}
    <CommentsDrawer {onClose} source={$drilldownSource} {media} {...props} />
  {/if}
</RenderFor>
