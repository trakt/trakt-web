<script lang="ts">
  import { goto } from "$app/navigation";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth.ts";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { summaryDrawerNavigation } from "$lib/sections/summary/summaryDrawerNavigation.ts";
  import CommentCard from "$lib/sections/summary/components/comments/CommentCard.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import CommentLanguageSelect from "./_internal/CommentLanguageSelect.svelte";
  import AddCommentAction from "./_internal/comment-actions/AddCommentAction.svelte";
  import { commentsPlaceholder } from "./_internal/commentsPlaceholder.ts";
  import { useCommentLanguage } from "./_internal/useCommentLanguage.svelte.ts";
  import type { ActiveComment } from "./_internal/models/ActiveComment";
  import { useComments } from "./_internal/useComments";
  import { useMineTab } from "./_internal/useMineTab.ts";
  import { useMyComments } from "./_internal/useMyComments.ts";
  import type { UseMyCommentsProps } from "./_internal/UseMyCommentsProps.ts";
  import type { CommentsProps } from "./CommentsProps";
  import AddReviewDrawerHost from "./drawers/AddReviewDrawerHost.svelte";

  const { media, ...props }: CommentsProps = $props();

  const {
    sort,
    mineActive,
    sortOptions,
    activeTab,
    activeText,
    onTabChange,
  } = useMineTab();

  const commentLanguage = useCommentLanguage();

  const { isLoading, list: comments } = $derived(
    useComments({
      slug: media.slug,
      sort: $sort.value,
      language: commentLanguage.filter,
      ...props,
    }),
  );

  const { isAuthorized } = useAuth();

  const { isEnabled } = useFeatureFlag();
  const isMineTabEnabled = $derived(isEnabled(FeatureFlag.ReviewsMineTab));
  const isPinMineEnabled = $derived(isEnabled(FeatureFlag.ReviewsPinMine));

  const myCommentsParams$ = fromRune((): UseMyCommentsProps => ({
    ...props,
    slug: media.slug,
    enabled: ($isAuthorized ?? false) &&
      ($isMineTabEnabled || $isPinMineEnabled),
  }));

  const { list: allMineNewestFirst, isLoading: isMineLoading } = useMyComments(
    myCommentsParams$,
  );

  const pinnedComments = $derived(
    $isPinMineEnabled && $allMineNewestFirst.length > 0
      ? $allMineNewestFirst.slice(0, 1)
      : [],
  );

  const popularOrRecentComments = $derived.by(() => {
    if (pinnedComments.length === 0) return $comments;

    const pinnedKeys = new Set(pinnedComments.map((comment) => comment.key));
    return [
      ...pinnedComments,
      ...$comments.filter((comment) => !pinnedKeys.has(comment.key)),
    ];
  });

  const displayedComments = $derived(
    $mineActive ? $allMineNewestFirst : popularOrRecentComments,
  );

  // With pinning on, the empty state waits for /comments/mine too, or an
  // empty public list flashes "No reviews yet" before the pin lands.
  const displayedIsLoading = $derived(
    $mineActive
      ? $isMineLoading
      : $isLoading || ($isPinMineEnabled && $isMineLoading),
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
  <ListMetaInfo text={$activeText()} />
{/snippet}

<RenderFor audience="all">
  <SectionList
    id={{
      scope: `comments-list-${props.type}`,
      key: `${media.slug}-${$activeTab}-${commentLanguage.value}`,
    }}
    items={displayedComments}
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
      {#if !displayedIsLoading}
        <p>
          {$mineActive
            ? m.list_placeholder_reviews_mine()
            : commentsPlaceholder(commentLanguage.value)}
        </p>
      {/if}
    {/snippet}

    {#snippet actions()}
      <Toggler
        value={$activeTab}
        onChange={onTabChange}
        options={$sortOptions}
      />

      <CommentLanguageSelect
        value={commentLanguage.value}
        onChange={commentLanguage.set}
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
