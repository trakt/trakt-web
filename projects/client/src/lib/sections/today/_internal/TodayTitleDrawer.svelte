<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PlayIcon from "$lib/components/icons/PlayIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { TodayTitleStory } from "../models/TodayTitleStory.ts";
  import TodayActionRow from "./TodayActionRow.svelte";
  import TodayCommentBubble from "./TodayCommentBubble.svelte";
  import TodayDrawerHeader from "./TodayDrawerHeader.svelte";
  import TodayFaces from "./TodayFaces.svelte";
  import TodayMilestoneChip from "./TodayMilestoneChip.svelte";
  import { todayStoryNavigation } from "./todayStoryNavigation.ts";
  import { toFriendActionLabel } from "./toFriendActionLabel.ts";
  import { toFriendActionTime } from "./toFriendActionTime.ts";
  import { toMediaMeta } from "./toMediaMeta.ts";

  const { story, onClose }: { story: TodayTitleStory; onClose: () => void } =
    $props();

  const { storyLink } = todayStoryNavigation();
  const link = $derived(storyLink(story.key));
</script>

<Drawer {onClose} size="auto">
  <div class="trakt-today-title-drawer">
    <TodayDrawerHeader
      href={UrlBuilder.media(story.media.type, story.media.slug)}
      cover={story.media.cover.url.medium}
      title={story.media.title}
      meta={toMediaMeta(story.media)}
    >
      {#snippet lead()}
        <div class="drawer-poster">
          <CrossOriginImage
            src={story.media.poster.url.thumb}
            alt={m.image_alt_media_poster({ title: story.media.title })}
          />
        </div>
      {/snippet}
      {#snippet badges()}
        <TodayFaces users={story.users} size="small" />
        {#if story.averageRating != null}
          <StemTag>
            <UserRating rating={story.averageRating} size="small" />
          </StemTag>
        {/if}
        {#if story.milestone}
          <TodayMilestoneChip milestone={story.milestone} />
        {/if}
      {/snippet}
    </TodayDrawerHeader>

    <ul class="drawer-timeline">
      {#each story.actions as action (action.key)}
        <TodayActionRow
          title={toDisplayableName(action.user)}
          action={toFriendActionLabel(action)}
          time={toFriendActionTime(action.activityAt)}
          rating={action.rating}
        >
          {#snippet lead()}
            <UserAvatar user={action.user} size="small" />
          {/snippet}
          {#if action.comment}
            <TodayCommentBubble comment={action.comment} lines={3} />
          {/if}
        </TodayActionRow>
      {/each}
    </ul>

    <div class="drawer-play">
      <Link
        href={link.href}
        noscroll={link.noscroll}
        replacestate={link.replacestate}
        label={m.button_label_play_story({ title: story.media.title })}
        color="inherit"
        onclick={onClose}
      >
        <span class="play-story">
          <span class="bold play-label">{m.button_text_play_story()}</span>
          <span class="play-icon" aria-hidden="true">
            <PlayIcon size="small" />
          </span>
        </span>
      </Link>
    </div>
  </div>
</Drawer>

<style lang="scss">
  .trakt-today-title-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    .drawer-poster {
      width: var(--ni-64);
      aspect-ratio: 2 / 3;
      overflow: hidden;

      border-radius: var(--border-radius-s);
      box-shadow: var(--shadow-base);

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .drawer-timeline {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);

      margin: 0;
      padding: 0;
      list-style: none;
    }
  }

  .drawer-play {
    position: sticky;
    bottom: 0;

    display: flex;
    justify-content: flex-end;
    padding-block: var(--gap-xs);

    pointer-events: none;

    :global(.trakt-link) {
      border-radius: var(--border-radius-xxl);
      text-decoration: none;
      pointer-events: auto;
    }

    :global(.trakt-link:focus-visible) {
      outline: var(--border-thickness-xs) solid var(--color-text-emphasis);
      outline-offset: var(--ni-2);
    }
  }

  .play-story {
    display: inline-flex;
    align-items: center;
    gap: var(--gap-s);

    padding-block: var(--ni-6);
    padding-inline: var(--ni-20) var(--ni-6);
    border-radius: var(--border-radius-xxl);

    background: var(--color-segmented-selector-background);
    color: var(--color-segmented-selector-foreground);
    -webkit-tap-highlight-color: transparent;
    box-shadow: 0 var(--ni-8) var(--ni-24)
      color-mix(in srgb, var(--purple-500) 45%, transparent);

    transition: var(--transition-increment) ease-out;
    transition-property: transform, box-shadow;

    .play-label {
      color: inherit;
    }

    .play-icon {
      display: flex;
      align-items: center;
      justify-content: center;

      width: var(--ni-36);
      height: var(--ni-36);
      border-radius: 50%;
      background: color-mix(in srgb, currentColor 18%, transparent);

      :global(svg) {
        width: var(--ni-14);
        height: var(--ni-14);
      }
    }

    &:hover {
      transform: translateY(calc(-1 * var(--ni-2)));
      box-shadow: 0 var(--ni-12) var(--ni-32)
        color-mix(in srgb, var(--purple-500) 60%, transparent);
    }

    &:active {
      transform: scale(0.97);
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;

      &:hover,
      &:active {
        transform: none;
      }
    }
  }
</style>
