<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import type { TodayStoryFrame } from "../models/TodayStoryFrame.ts";
  import TodayCommentBubble from "./TodayCommentBubble.svelte";
  import TodayForYouAction from "./TodayForYouAction.svelte";
  import TodayMilestoneChip from "./TodayMilestoneChip.svelte";
  import TodayPosterDetails from "./TodayPosterDetails.svelte";
  import { toFrameMedia } from "./toFrameMedia.ts";
  import { toFriendActionText } from "./toFriendActionText.ts";

  const { frame, isFlipped }: { frame: TodayStoryFrame; isFlipped: boolean } =
    $props();

  const media = $derived(toFrameMedia(frame));
  const milestone = $derived.by(() => {
    if (frame.type === "friend") return frame.action.milestone;
    if (frame.type === "summary") return frame.story.milestone;
    return null;
  });
</script>

<div class="trakt-today-story-frame-content" data-type={frame.type}>
  <div class="frame-poster">
    <div
      class="poster-card"
      class:is-flipped={isFlipped}
      data-milestone={milestone?.type}
    >
      {#if milestone && !isFlipped}
        <div class="poster-milestone">
          <TodayMilestoneChip {milestone} />
        </div>
      {/if}
      <div class="poster-face">
        <CrossOriginImage
          src={media.poster.url.medium}
          alt={m.image_alt_media_poster({ title: media.title })}
        />
      </div>
      <div class="poster-face is-back" aria-hidden={!isFlipped}>
        {#if isFlipped}
          <TodayPosterDetails {media} />
        {/if}
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
        <p class="tag uppercase bold frame-kicker">
          {frame.item.type === "up-next"
            ? m.tag_text_today_new_episode()
            : m.tag_text_today_released()}
        </p>
        <h2 class="frame-headline">{media.title}</h2>
        {#if frame.item.type === "up-next"}
          <p class="secondary">
            {m.text_season_episode_number(frame.item.entry)} · {frame.item.entry
              .title}
          </p>
        {/if}
      </div>
    {/if}

    {#if frame.type === "summary"}
      <div class="frame-text">
        <h2 class="frame-headline">
          {m.text_today_friends_watched({ count: frame.story.users.length })}
        </h2>
        <div class="frame-faces">
          {#each frame.story.users as user (user.key)}
            <CrossOriginImage src={user.avatar.url} alt="" />
          {/each}
        </div>
        {#if frame.story.averageRating != null}
          <div class="frame-rating">
            <UserRating rating={frame.story.averageRating} />
          </div>
        {/if}
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
          {#if frame.action.rating != null}
            <div class="frame-rating">
              <UserRating rating={frame.action.rating} />
            </div>
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

      perspective: var(--ni-1280);
    }

    .poster-card {
      position: relative;

      height: 100%;
      max-width: 100%;
      aspect-ratio: 2 / 3;

      transform-style: preserve-3d;
      transition: transform var(--transition-duration-short) ease-in-out;

      &.is-flipped {
        transform: rotateY(180deg);
      }
    }

    .poster-milestone {
      position: absolute;
      top: var(--gap-s);
      left: 50%;
      z-index: var(--layer-floating);

      max-width: calc(100% - var(--gap-m));
      transform: translateX(-50%) translateZ(var(--ni-1));
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

    .frame-rating :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
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
