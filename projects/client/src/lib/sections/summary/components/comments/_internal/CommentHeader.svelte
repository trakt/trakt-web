<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import TextCardHeader from "$lib/sections/components/text-card/TextCardHeader.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import CommentActions from "../CommentActions.svelte";
  import type { CommentTypeProps } from "../CommentsProps.ts";
  import AddReviewDrawerHost from "../drawers/AddReviewDrawerHost.svelte";
  import CommenterRating from "./CommenterRating.svelte";
  import ReviewerStatsTag from "./ReviewerStatsTag.svelte";

  type CommentHeaderProps = {
    comment: MediaComment;
    media: MediaEntry;
  } & CommentTypeProps;

  const { comment, media, ...typeProps }: CommentHeaderProps = $props();

  let isEditOpen = $state(false);

  const { user } = useUser();
  const isOwnComment = $derived(comment.user.id === $user.id);

  const { isEnabled } = useFeatureFlag();
  const isReviewerStatsEnabled = $derived(
    isEnabled(FeatureFlag.ReviewerStats),
  );

  const subTitle = $derived(
    toHumanDay({
      date: comment.createdAt,
      locale: getLocale(),
      format: $isReviewerStatsEnabled ? "short" : "long",
    }),
  );
</script>

<div class="trakt-comment-header">
  <TextCardHeader {subTitle}>
    {#snippet icon()}
      <UserAvatar user={comment.user} size="small" />
    {/snippet}

    {#snippet actions()}
      <div class="trakt-comment-header-actions">
        <RenderForFeature flag={FeatureFlag.ReviewerStats}>
          {#snippet enabled()}
            <ReviewerStatsTag
              review={comment}
              {media}
              isOwnReview={isOwnComment}
              {...typeProps}
            />
          {/snippet}

          <CommenterRating {comment} />
        </RenderForFeature>

        <RenderFor audience="authenticated">
          <CommentActions
            {comment}
            type={typeProps.type}
            {isOwnComment}
            onEdit={() => (isEditOpen = true)}
          />
        </RenderFor>
      </div>
    {/snippet}

    <UserProfileLink user={comment.user} />
  </TextCardHeader>
</div>

{#if isEditOpen}
  <AddReviewDrawerHost
    onClose={() => {
      isEditOpen = false;
    }}
    onCommentPost={() => {
      isEditOpen = false;
    }}
    mode="edit"
    {comment}
    {media}
    {...typeProps}
  />
{/if}

<style>
  .trakt-comment-header {
    :global(.trakt-user-avatar) {
      position: relative;
    }

    :global(.trakt-user-rating-icon) {
      position: absolute;
      top: var(--ni-neg-4);
      inset-inline-end: var(--ni-neg-10);
    }
  }

  .trakt-comment-header-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
