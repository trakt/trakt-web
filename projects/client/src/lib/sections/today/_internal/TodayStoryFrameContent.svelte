<script lang="ts">
  import WatchedTag from "$lib/components/media/tags/WatchedTag.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { pointerWithin } from "$lib/utils/actions/pointerWithin.ts";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { time } from "$lib/utils/timing/time.ts";
  import { onMount } from "svelte";
  import type { TodayStoryFrame } from "../models/TodayStoryFrame.ts";
  import TodayCommentBubble from "./TodayCommentBubble.svelte";
  import TodayForYouAction from "./TodayForYouAction.svelte";
  import TodayMilestoneChip from "./TodayMilestoneChip.svelte";
  import TodayPosterDetails from "./TodayPosterDetails.svelte";
  import { toFrameMedia } from "./toFrameMedia.ts";
  import { hasWatchedToo } from "./hasWatchedToo.ts";
  import { toFriendActionText } from "./toFriendActionText.ts";
  

  const HOVER_EXIT_MARGIN = 16;
  const BACK_PRELOAD_DELAY = time.seconds(0.25);

  let {
    frame,
    isFlipped = $bindable(false),
  }: { frame: TodayStoryFrame; isFlipped?: boolean } = $props();

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
      <div
        class="poster-card"
        class:is-flipped={isFlipped}
        data-milestone={milestone?.type}
      >
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
        <div class="poster-face">
          <CrossOriginImage
            src={media.poster.url.medium}
            alt={m.image_alt_media_poster({ title: media.title })}
          />
        </div>
        <div class="poster-face is-back" inert={!isFlipped}>
          {#if showBack}
            <TodayPosterDetails {media} />
          {/if}
        </div>
      </div>
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
              · {m.text_season_episode_number(frame.item.entry)} · {frame.item
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
            {#each frame.story.users as user (user.key)}
              <CrossOriginImage src={user.avatar.url} alt="" />
            {/each}
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
            <p class="small secondary">{toFriendActionText(frame.action)}</p>
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
      --poster-natural-width: calc(100cqh * 2 / 3);

      position: relative;

      height: 100%;
      max-width: 100%;
      aspect-ratio: 2 / 3;
      width: min(
        100cqw,
        calc(
          var(--poster-natural-width) +
            max(0px, (var(--poster-natural-width) - 94cqw) * 50)
        )
      );

      perspective: var(--ni-1280);
    }

    .poster-card {
      position: absolute;
      inset: 0;

      transform-style: preserve-3d;
      transition: transform calc(var(--transition-duration-short) * 0.75)
        cubic-bezier(0.3, 0.7, 0.2, 1);

      &.is-flipped {
        transform: rotateY(180deg);
      }
    }

    .poster-rating {
      --color-background-stem-tag: var(--color-background-indicator-tag);
      --color-foreground-stem-tag: var(--color-text-indicator-tag);

      position: absolute;
      bottom: var(--gap-s);
      inset-inline-end: var(--gap-s);
      z-index: var(--layer-floating);

      transform: translateZ(var(--ni-1));
    }

    .poster-watched {
      position: absolute;
      bottom: 0;
      left: 50%;
      z-index: var(--layer-floating);

      max-width: calc(100% - var(--gap-m));
      transform: translate(-50%, 50%) translateZ(var(--ni-1));
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
      position: absolute;
      inset: 0;
      overflow: hidden;

      border-radius: var(--border-radius-l);
      box-shadow: var(--shadow-base);
      backface-visibility: hidden;

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &.is-back {
        transform: rotateY(180deg);
        background: var(--color-card-background);
      }
    }

    .frame-comment {
      position: relative;
      z-index: var(--layer-raised);
      flex-shrink: 0;
    }

    .frame-footer {
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
      margin-inline-start: calc(-1 * var(--border-thickness-xs));

      :global(img) {
        width: var(--ni-28);
        height: var(--ni-28);
        margin-inline-end: calc(-1 * var(--ni-8));

        border: var(--border-thickness-xs) solid var(--color-background);
        border-radius: 50%;
      }
    }

    .frame-person {
      display: flex;
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
      flex-grow: 1;
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
