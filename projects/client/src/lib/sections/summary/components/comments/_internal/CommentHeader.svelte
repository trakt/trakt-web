<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import RateIcon from "$lib/components/icons/RateIcon.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import UserAvatar from "../../_internal/UserAvatar.svelte";
  import UserProfileLink from "../../_internal/UserProfileLink.svelte";
  import { mapRatingToSimpleRating } from "../../rating/mapRatingToSimpleRating";
  import UserRatingIcon from "./UserRatingIcon.svelte";

  const { comment }: { comment: MediaComment } = $props();

  const commenterRating = $derived(
    comment.user.stats.rating &&
      mapRatingToSimpleRating(comment.user.stats.rating),
  );
</script>

{#snippet icon()}
  {#if commenterRating}
    <div class="trakt-avatar-icon">
      <RateIcon rating={commenterRating} />
    </div>
  {/if}
{/snippet}

<div class="trakt-comment-header" class:is-vip={comment.user.isVip}>
  <UserAvatar
    src={comment.user.avatar.url}
    name={comment.user.userName}
    size="small"
  >
    {#snippet icon()}
      {#if commenterRating}
        <UserRatingIcon rating={commenterRating} />
      {/if}
    {/snippet}
  </UserAvatar>

  <div class="trakt-comment-details">
    <div class="trakt-comment-user">
      <p class="small secondary">
        {comment.isReview ? m.review_by() : m.shout_by()}
      </p>
      <UserProfileLink slug={comment.user.slug} name={comment.user.userName} />
      {#if comment.user.isVip}
        <VipBadge />
      {/if}
    </div>
    <p class="small secondary meta-info">
      {toHumanDate(new Date(), comment.createdAt, getLocale())}
    </p>
  </div>
</div>

<style>
  .trakt-comment-header {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    &.is-vip {
      :global(.trakt-user-avatar img) {
        border: var(--ni-2) solid var(--color-background-vip-badge);
      }
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
    gap: var(--gap-xs);

    height: var(--ni-18);
  }
</style>
