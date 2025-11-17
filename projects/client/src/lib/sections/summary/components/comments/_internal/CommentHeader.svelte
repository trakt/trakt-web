<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import DeleteCommentButton from "./comment-actions/DeleteCommentButton.svelte";

  const { comment, type }: { comment: MediaComment; type: ExtendedMediaType } =
    $props();
</script>

<div class="trakt-comment-header">
  <div class="trakt-comment-header-content">
    <UserAvatar user={comment.user} size="small" />

    <div class="trakt-comment-details">
      <div class="trakt-comment-user">
        <UserProfileLink user={comment.user} />
      </div>
      <p class="secondary meta-info">
        {toHumanDay(comment.createdAt, getLocale())}
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
