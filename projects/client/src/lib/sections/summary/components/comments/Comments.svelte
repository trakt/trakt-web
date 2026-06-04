<script lang="ts">
  import { goto } from "$app/navigation";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useToggler } from "$lib/components/toggles/useToggler";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { summaryDrawerNavigation } from "$lib/sections/summary/_internal/summaryDrawerNavigation";
  import CommentCard from "$lib/sections/summary/components/comments/CommentCard.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import AddCommentAction from "./_internal/comment-actions/AddCommentAction.svelte";
  import type { ActiveComment } from "./_internal/models/ActiveComment";
  import { useComments } from "./_internal/useComments";
  import type { CommentsProps } from "./CommentsProps";
  import AddReviewDrawerHost from "./drawers/AddReviewDrawerHost.svelte";

  const { media, ...props }: CommentsProps = $props();

  const { current: sortType, set, options } = useToggler("comment");

  const { isLoading, list: comments } = $derived(
    useComments({
      slug: media.slug,
      sort: $sortType.value,
      ...props,
    }),
  );

  const { buildCommentsDrawerLink } = summaryDrawerNavigation();

  const isPostReviewOpen = writable(false);
  const onClosePostReview = () => isPostReviewOpen.set(false);

  const onDrilldown = (comment?: ActiveComment) => {
    const link = buildCommentsDrawerLink(comment?.id);
    goto(link.href, {
      noScroll: link.noscroll,
      replaceState: link.replacestate,
    });
  };
</script>

{#snippet metaInfo()}
  <ListMetaInfo text={$sortType.text()} />
{/snippet}

<RenderFor audience="all">
  <SectionList
    id={{
      scope: `comments-list-${props.type}`,
      key: `${media.slug}-${$sortType.value}`,
    }}
    items={$comments}
    title={m.list_title_comments()}
    --height-list="var(--height-comments-list)"
    {metaInfo}
    drilldown={{
      ...buildCommentsDrawerLink(),
      label: m.button_label_view_all_comments(),
      source: { id: "comments" },
    }}
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
          set(value);
        }}
        {options}
      />

      <AddCommentAction
        onclick={() => {
          isPostReviewOpen.set(true);
        }}
      />
    {/snippet}
  </SectionList>

  {#if $isPostReviewOpen}
    <AddReviewDrawerHost
      onClose={onClosePostReview}
      onCommentPost={onDrilldown}
      mode="post"
      {media}
      {...props}
    />
  {/if}
</RenderFor>
