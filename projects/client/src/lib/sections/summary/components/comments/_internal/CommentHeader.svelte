<script lang="ts">
  import { getLocale } from "$lib/features/i18n";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import type { MediaComment } from "$lib/requests/models/MediaComment";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import TextCardHeader from "../../_internal/TextCardHeader.svelte";
  import DeleteCommentButton from "./comment-actions/DeleteCommentButton.svelte";
  import CommenterRating from "./CommenterRating.svelte";

  const { comment, type }: { comment: MediaComment; type: ExtendedMediaType } =
    $props();
</script>

<div class="trakt-comment-header">
  <TextCardHeader subTitle={toHumanDay(comment.createdAt, getLocale())}>
    {#snippet icon()}
      <UserAvatar user={comment.user} size="small" />
    {/snippet}

    {#snippet actions()}
      <CommenterRating {comment} />
      <DeleteCommentButton {comment} {type} />
    {/snippet}

    <UserProfileLink user={comment.user} />
  </TextCardHeader>
</div>

<style>
  .trakt-comment-header {
    :global(.trakt-user-avatar) {
      position: relative;
    }

    :global(.trakt-user-rating-icon) {
      position: absolute;
      top: var(--ni-neg-4);
      right: var(--ni-neg-10);
    }
  }
</style>
