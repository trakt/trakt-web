<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry.ts";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import TextCardHeader from "../../_internal/TextCardHeader.svelte";
  import type {
    EpisodeCommentProps,
    MediaCommentProps,
  } from "../CommentsProps.ts";
  import CommentActions from "./comment-actions/CommentActions.svelte";
  import CommenterRating from "./CommenterRating.svelte";
  import AddReviewDrawer from "./drawers/AddReviewDrawer.svelte";

  type CommentHeaderProps = {
    comment: MediaComment;
    media: MediaEntry;
  } & (MediaCommentProps | EpisodeCommentProps);

  const { comment, media, ...typeProps }: CommentHeaderProps = $props();

  let isEditOpen = $state(false);

  const { user } = useUser();
  const isOwnComment = $derived(comment.user.id === $user.id);
</script>

<div class="trakt-comment-header">
  <TextCardHeader subTitle={toHumanDay({ date: comment.createdAt, locale: getLocale() })}>
    {#snippet icon()}
      <UserAvatar user={comment.user} size="small" />
    {/snippet}

    {#snippet actions()}
      <div class="trakt-comment-header-actions">
        <CommenterRating {comment} />

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
  <AddReviewDrawer
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
      right: var(--ni-neg-10);
    }
  }

  .trakt-comment-header-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
