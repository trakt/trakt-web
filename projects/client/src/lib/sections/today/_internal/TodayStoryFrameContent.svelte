<script lang="ts">
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import WatchedTag from "$lib/components/media/tags/WatchedTag.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import FlipCard from "$lib/components/card/FlipCard.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { pointerWithin } from "$lib/utils/actions/pointerWithin.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { onMount } from "svelte";
  import TodayCommentBubble from "./TodayCommentBubble.svelte";
  import TodayFaces from "./TodayFaces.svelte";
  import TodayForYouAction from "./TodayForYouAction.svelte";
  import TodayMilestoneChip from "./TodayMilestoneChip.svelte";
  import TodayPosterDetails from "./TodayPosterDetails.svelte";
  import type { TodayStoryFrameContentProps } from "./TodayStoryFrameContentProps.ts";
  import TodayStoryTapZones from "./TodayStoryTapZones.svelte";
  import { toFrameMedia } from "./toFrameMedia.ts";
  import { hasWatchedToo } from "./hasWatchedToo.ts";
  import { toFriendActionLabel } from "./toFriendActionLabel.ts";
  import { toFriendActionTime } from "./toFriendActionTime.ts";
  

  const HOVER_EXIT_MARGIN = 16;
  const BACK_PRELOAD_DELAY = time.seconds(0.25);

  let {
    frame,
    isFlipped = $bindable(false),
    onTap,
    onPressStart,
    onPressEnd,
  }: TodayStoryFrameContentProps = $props();

  const { history } = useUser();

  const media = $derived(toFrameMedia(frame));
  const isWatchedToo = $derived(
    frame.type !== "for-you" && hasWatchedToo({ history: $history, media }),
  );

  let hasPreloadedBack = $state(false);
  const showBack = $derived(hasPreloadedBack || isFlipped);

  onMount(() => {
    const timeout = setTimeout(() => {
      hasPreloadedBack = true;
    }, BACK_PRELOAD_DELAY);

    return () => clearTimeout(timeout);
  });
  const rating = $derived.by(() => {
    if (frame.type === "friend") return frame.action.rating;
    if (frame.type === "summary") return frame.story.averageRating;
    return null;
  });
  const milestone = $derived.by(() => {
    if (frame.type === "friend") return frame.action.milestone;
    if (frame.type === "summary") return frame.story.milestone;
    return null;
  });
</script>

<div class="trakt-today-story-frame-content" data-type={frame.type}>
  <div class="frame-poster">
    <div
      class="poster-hit"
      use:pointerWithin={{
        onChange: (isWithin) => (isFlipped = isWithin),
        exitMargin: HOVER_EXIT_MARGIN,
      }}
    >
      <div class="poster-card" data-milestone={milestone?.type}>
        {#if rating != null && !isFlipped}
          <div class="poster-rating">
            <StemTag>
              <UserRating {rating} size="small" />
            </StemTag>
          </div>
        {/if}
        {#if isWatchedToo && !isFlipped}
          <div class="poster-watched">
            <WatchedTag variant="full" />
          </div>
        {/if}
        <FlipCard
          {isFlipped}
          --border-radius-flip-card="var(--border-radius-l)"
          --height-flip-card="100%"
        >
          {#snippet front()}
            <div class="poster-face">
              <CrossOriginImage
                src={media.poster.url.medium}
                alt={m.image_alt_media_poster({ title: media.title })}
              />
            </div>
          {/snippet}
          {#snippet back()}
            <div class="poster-face is-back">
              {#if showBack}
                <TodayPosterDetails {media} />
              {/if}
            </div>
          {/snippet}
        </FlipCard>
      </div>
      {#if onTap && onPressStart && onPressEnd}
        <TodayStoryTapZones
          {isFlipped}
          {onTap}
          {onPressStart}
          {onPressEnd}
        />
      {/if}
    </div>
  </div>

  {#if frame.type === "friend" && frame.action.comment}
    <div class="frame-comment">
      <TodayCommentBubble comment={frame.action.comment} />
    </div>
  {/if}

  <div class="frame-footer">
    {#if frame.type === "for-you"}
      <div class="frame-text">
        <p class="ellipsis">
          <span class="tag uppercase bold frame-kicker">
            {frame.item.type === "up-next"
              ? m.tag_text_today_new_episode()
              : m.tag_text_today_released()}
          </span>
          {#if frame.item.type === "up-next"}
            <span class="tag secondary">
              · {episodeNumberLabel({ seasonNumber: frame.item.entry.season, episodeNumber: frame.item.entry.number })} · {frame.item
                .entry.title}
            </span>
          {/if}
        </p>
        <h2 class="frame-headline">{media.title}</h2>
      </div>
    {/if}

    {#if frame.type === "summary"}
      <div class="frame-text">
        <h2 class="frame-headline">
          {m.text_today_friends_watched({ count: frame.story.users.length })}
        </h2>
        <div class="frame-meta">
          <div class="frame-faces">
            <TodayFaces users={frame.story.users} />
          </div>
          {#if frame.story.milestone}
            <TodayMilestoneChip milestone={frame.story.milestone} />
          {/if}
        </div>
      </div>
    {/if}

    {#if frame.type === "friend"}
      <div class="frame-text">
        <div class="frame-person">
          <CrossOriginImage
            src={frame.action.user.avatar.url}
            alt={m.image_alt_user_avatar({
              username: frame.action.user.username,
            })}
          />
          <div class="frame-person-info">
            <p class="bold ellipsis">{toDisplayableName(frame.action.user)}</p>
            <p class="small ellipsis">{toFriendActionLabel(frame.action)}</p>
            <p class="small secondary ellipsis">
              {toFriendActionTime(frame.action.activityAt)}
            </p>
          </div>
          {#if frame.action.milestone}
            <TodayMilestoneChip milestone={frame.action.milestone} />
          {/if}
        </div>
      </div>
    {/if}

    <div class="frame-actions">
      {#if frame.type === "for-you"}
        <TodayForYouAction item={frame.item} />
      {:else}
        <WatchlistAction
          style="action"
          type={frame.story.media.type}
          title={frame.story.media.title}
          media={frame.story.media}
        />
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .trakt-today-story-frame-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    flex-grow: 1;
    min-height: 0;

    .frame-poster {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
      min-height: 0;

      container-type: size;
    }

    .poster-hit {
      position: relative;

      width: min(100cqw, 100cqh * 2 / 3);
      aspect-ratio: 2 / 3;
    }

    .poster-card {
      position: absolute;
      inset: 0;
    }

    .poster-rating {
      --color-background-stem-tag: var(--color-background-indicator-tag);
      --color-foreground-stem-tag: var(--color-text-indicator-tag);

      position: absolute;
      bottom: var(--gap-s);
      inset-inline-end: var(--gap-s);
      z-index: var(--layer-floating);
    }

    .poster-watched {
      position: absolute;
      bottom: 0;
      left: 50%;
      z-index: var(--layer-floating);

      max-width: calc(100% - var(--gap-m));
      transform: translate(-50%, 50%);
    }

    .poster-card[data-milestone] .poster-face {
      box-shadow:
        0 0 0 var(--border-thickness-xs) var(--purple-400),
        0 0 var(--ni-40) color-mix(in srgb, var(--purple-500) 55%, transparent);
    }

    .poster-card[data-milestone="series-end"] .poster-face {
      animation: today-milestone-glow 2.4s ease-in-out infinite alternate;
    }

    .poster-face {
      box-sizing: border-box;
      height: 100%;
      overflow: hidden;

      border-radius: var(--border-radius-l);
      box-shadow: var(--shadow-base);

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.is-back {
        border: var(--border-thickness-xxs) solid var(--color-border);
        background: var(--color-card-background);
      }
    }

    .frame-comment {
      position: relative;
      z-index: var(--layer-raised);
      flex-shrink: 0;
    }

    .frame-footer {
      position: relative;
      z-index: var(--layer-raised);

      display: flex;
      align-items: center;
      gap: var(--gap-m);
      flex-shrink: 0;
      min-height: var(--ni-64);
    }

    .frame-meta {
      display: flex;
      align-items: center;
      gap: var(--gap-s);
    }

    .frame-actions {
      position: relative;
      z-index: var(--layer-raised);

      display: flex;
      flex-shrink: 0;
      gap: var(--gap-s);
    }

    .frame-text {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
      flex-grow: 1;
      min-width: 0;
    }

    .frame-kicker {
      color: var(--color-text-emphasis);
    }

    .frame-headline {
      margin: 0;
    }

    .frame-faces {
      display: flex;
      margin-inline: calc(-1 * var(--border-thickness-xs))
        calc(-1 * var(--ni-8));
    }

    .frame-person {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--gap-s);

      :global(img) {
        width: var(--ni-44);
        height: var(--ni-44);

        border: var(--border-thickness-xs) solid var(--purple-500);
        border-radius: 50%;
      }
    }

    .frame-person-info {
      display: flex;
      flex-direction: column;
      flex: 1 1 var(--ni-120);
      min-width: 0;
    }

  }

  @keyframes today-milestone-glow {
    from {
      box-shadow:
        0 0 0 var(--border-thickness-xs) var(--purple-400),
        0 0 var(--ni-24) color-mix(in srgb, var(--purple-500) 35%, transparent);
    }
    to {
      box-shadow:
        0 0 0 var(--border-thickness-xs) var(--purple-300),
        0 0 var(--ni-64) color-mix(in srgb, var(--purple-400) 75%, transparent);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .trakt-today-story-frame-content .poster-card .poster-face {
      animation: none;
    }
  }
</style>
