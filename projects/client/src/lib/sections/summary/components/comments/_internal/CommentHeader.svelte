<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { mapRatingToSimpleRating } from "../../rating/mapRatingToSimpleRating";
  import DeleteCommentButton from "./comment-actions/DeleteCommentButton.svelte";
  import UserRatingIcon from "./UserRatingIcon.svelte";

  const { comment, type }: { comment: MediaComment; type: ExtendedMediaType } =
    $props();

  const commenterRating = $derived(
    comment.user.stats.rating &&
      mapRatingToSimpleRating(comment.user.stats.rating),
  );
</script>

<div class="trakt-comment-header">
  <div class="trakt-comment-header-content">
    <UserAvatar user={comment.user} size="small">
      {#snippet icon()}
        {#if commenterRating}
          <UserRatingIcon rating={commenterRating} />
        {/if}
      {/snippet}
    </UserAvatar>

    <div class="trakt-comment-details">
      <div class="trakt-comment-user">
        <p class="small secondary">
          {comment.isReview ? m.text_review_by() : m.text_shout_by()}
        </p>
        <UserProfileLink user={comment.user} />
      </div>
      <p class="small secondary meta-info">
        {toHumanDate(new Date(), comment.createdAt, getLocale())}
      </p>
    </div>
  </div>

  <div class="trakt-comment-header-actions">
    <DeleteCommentButton {comment} {type} />
  </div>
</div>

<style>
  .trakt-comment-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: var(--gap-s);
  }

  .trakt-comment-header-content {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    height: var(--ni-32);

    :global(.trakt-user-avatar) {
      position: relative;
    }

    :global(.trakt-user-rating-icon) {
      position: absolute;
      top: var(--ni-neg-4);
      right: var(--ni-neg-10);
    }
  }

  .trakt-comment-details {
    display: flex;
    flex-direction: column;

    :global(.trakt-vip-badge) {
      transform: scale(0.6);
      margin-left: var(--ni-neg-12);
    }
  }

  .trakt-comment-user {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    height: var(--ni-18);
  }
</style>
