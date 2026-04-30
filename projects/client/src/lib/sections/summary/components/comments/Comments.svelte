<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import ViewAllButton from "$lib/sections/lists/components/ViewAllButton.svelte";
  import CommentCard from "$lib/sections/summary/components/comments/CommentCard.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import AddCommentAction from "./_internal/comment-actions/AddCommentAction.svelte";
  import type { ActiveComment } from "./_internal/models/ActiveComment";
  import { useComments } from "./_internal/useComments";
  import type { CommentsProps } from "./CommentsProps";
  import AddReviewDrawer from "./drawers/AddReviewDrawer.svelte";
  import CommentsDrawer from "./drawers/CommentsDrawer.svelte";

  const { media, ...props }: CommentsProps = $props();

  const { current: sortType, set, options } = useToggler("comment");

  const { isLoading, list: comments } = $derived(
    useComments({
      slug: media.slug,
      sort: $sortType.value,
      ...props,
    }),
  );

  const drilldownSource = writable<ActiveComment | undefined>(undefined);

  const isOpen = writable(false);
  const onClose = () => isOpen.set(false);

  const isPostReviewOpen = writable(false);
  const onClosePostReview = () => isPostReviewOpen.set(false);

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
      <CommentCard {comment} {media} {onDrilldown} {...props} />
    {/snippet}

    {#snippet empty()}
      {#if !$isLoading}
        <p>{m.list_placeholder_comments()}</p>
      {/if}
    {/snippet}

    {#snippet actions()}
      <Toggler
        value={$sortType.value}
        onChange={(value) => {
          drilldownSource.set(undefined);
          set(value);
        }}
        {options}
      />

      <AddCommentAction
        onclick={() => {
          isPostReviewOpen.set(true);
        }}
      />

      <ViewAllButton
        label={m.button_label_view_all_comments()}
        onclick={() => onDrilldown()}
        source={{ id: "comments" }}
      />
    {/snippet}
  </SectionList>

  {#if $isPostReviewOpen}
    <AddReviewDrawer
      onClose={onClosePostReview}
      onCommentPost={onDrilldown}
      mode="post"
      {media}
      {...props}
    />
  {/if}

  {#if $isOpen}
    <CommentsDrawer {onClose} source={$drilldownSource} {media} {...props} />
  {/if}
</RenderFor>
