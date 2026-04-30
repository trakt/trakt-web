<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaComment } from "$lib/requests/models/MediaComment.ts";
  import type { UserCommentEntry } from "$lib/requests/queries/users/userCommentsQuery.ts";
  import TextCardHeader from "$lib/sections/components/text-card/TextCardHeader.svelte";
  import CommentActions from "$lib/sections/summary/components/comments/CommentActions.svelte";
  import CommentCard from "$lib/sections/summary/components/comments/CommentCard.svelte";
  import AddReviewDrawer from "$lib/sections/summary/components/comments/drawers/AddReviewDrawer.svelte";
  import CommentThreadCard from "$lib/sections/summary/components/comments/drawers/CommentThreadCard.svelte";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { ACTIVITY_LIST_CLASS } from "./drawers/constants.ts";

  type ActivityCommentItemProps = {
    entry: UserCommentEntry;
    onDrilldown?: (commentId: number) => void;
    variant?: "default" | "summary";
    shouldScrollIntoView?: boolean;
    isReplying?: boolean;
    setReplying?: (comment: MediaComment, isReplying: boolean) => void;
    reset?: () => void;
  };

  const {
    entry,
    onDrilldown,
    variant = "default",
    shouldScrollIntoView = false,
    isReplying = false,
    setReplying,
    reset,
  }: ActivityCommentItemProps = $props();

  let isEditOpen = $state(false);

  const commentTypeProps = $derived(
    entry.type === "episode"
      ? {
          type: "episode" as const,
          season: entry.episode.season,
          episode: entry.episode.number,
          id: entry.episode.id,
          media: entry.media,
        }
      : { type: entry.type, media: entry.media },
  );

  const mediaLink = $derived(
    entry.type === "episode"
      ? UrlBuilder.episode(
          entry.media.slug,
          entry.episode.season,
          entry.episode.number,
        )
      : UrlBuilder.media(entry.type, entry.media.slug),
  );

  const mediaTitle = $derived(
    entry.type === "episode"
      ? entry.media.title +
          " - " +
          episodeNumberLabel({
            seasonNumber: entry.episode.season,
            episodeNumber: entry.episode.number,
          })
      : entry.media.title,
  );

  const posterSrc = $derived(
    entry.type === "episode"
      ? (entry.episode.cover.url ?? entry.media.poster.url.thumb)
      : entry.media.poster.url.thumb,
  );
</script>

{#snippet mediaHeader()}
  <TextCardHeader
    subTitle={toHumanDay({
      date: entry.comment.createdAt,
      locale: getLocale(),
    })}
  >
    {#snippet icon()}
      <Link href={mediaLink}>
        <div
          class="trakt-activity-comment-poster"
          data-variant={entry.type === "episode" ? "landscape" : "portrait"}
        >
          <CrossOriginImage
            src={posterSrc}
            alt={m.image_alt_media_poster({ title: entry.media.title })}
          />
        </div>
      </Link>
    {/snippet}

    <Link href={mediaLink}>
      {mediaTitle}
    </Link>

    {#snippet actions()}
      <RenderFor audience="authenticated">
        <CommentActions
          comment={entry.comment}
          type={entry.type}
          isOwnComment={true}
          onEdit={() => (isEditOpen = true)}
        />
      </RenderFor>
    {/snippet}
  </TextCardHeader>
{/snippet}

{#if variant === "summary"}
  <CommentThreadCard
    comment={entry.comment}
    {...commentTypeProps}
    {shouldScrollIntoView}
    scrollContainerClass={ACTIVITY_LIST_CLASS}
    {isReplying}
    setReplying={setReplying ?? (() => {})}
    reset={reset ?? (() => {})}
  >
    {#snippet header()}
      {@render mediaHeader()}
    {/snippet}
  </CommentThreadCard>
{:else}
  <CommentCard
    comment={entry.comment}
    {...commentTypeProps}
    onDrilldown={(activeComment) => onDrilldown?.(activeComment.id)}
  >
    {#snippet header()}
      {@render mediaHeader()}
    {/snippet}
  </CommentCard>
{/if}

{#if isEditOpen}
  <AddReviewDrawer
    onClose={() => (isEditOpen = false)}
    onCommentPost={() => (isEditOpen = false)}
    mode="edit"
    comment={entry.comment}
    {...commentTypeProps}
  />
{/if}

<style lang="scss">
  .trakt-activity-comment-poster {
    flex-shrink: 0;
    border-radius: var(--border-radius-xs);
    overflow: hidden;
    box-shadow: var(--shadow-floating);

    &[data-variant="portrait"] {
      height: var(--ni-44);
      aspect-ratio: 2 / 3;
    }

    &[data-variant="landscape"] {
      height: var(--ni-32);
      aspect-ratio: 16 / 9;
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
