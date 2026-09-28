<script lang="ts">
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { dedupe } from "$lib/utils/array/dedupe.ts";
  import type { TodayStoryGroup } from "../models/TodayStoryGroup.ts";
  import { todayStoryNavigation } from "./todayStoryNavigation.ts";
  import TodayMilestoneIcon from "./TodayMilestoneIcon.svelte";
  import { toFrameMedia } from "./toFrameMedia.ts";

  const MAX_FACES = 2;
  const MAX_STACKED_POSTERS = 3;

  const { group, isSeen }: { group: TodayStoryGroup; isSeen: boolean } =
    $props();

  const { storyLink } = todayStoryNavigation();
  const link = $derived(storyLink(group.key));

  const title = $derived(
    group.type === "for-you" ? m.text_today_for_you() : group.story.media.title,
  );
  const faces = $derived(
    group.type === "title" ? group.story.users.slice(0, MAX_FACES) : [],
  );
  const stack = $derived.by(() => {
    const media = dedupe(
      (entry) => entry.key,
      group.frames.map(toFrameMedia),
    ).slice(0, MAX_STACKED_POSTERS);
    const middle = (media.length - 1) / 2;

    return media
      .map((entry, index) => ({ entry, offset: index - middle }))
      .toReversed();
  });
  const backdrop = $derived(
    group.frames.map(toFrameMedia).at(0)?.cover.url.thumb,
  );
</script>

<Link
  href={link.href}
  noscroll={link.noscroll}
  replacestate={link.replacestate}
  label={m.button_label_open_story({ title })}
>
  <div class="trakt-today-story-bubble" class:is-seen={isSeen}>
    <div class="bubble-ring">
      <div class="bubble-inner">
        {#if group.type === "for-you"}
          <div class="bubble-for-you">
            {#if backdrop}
              <div class="for-you-backdrop">
                <CrossOriginImage src={backdrop} alt="" />
              </div>
            {/if}
            {#each stack as { entry, offset } (entry.key)}
              <div class="for-you-poster" style="--stack-offset: {offset}">
                <CrossOriginImage src={entry.poster.url.thumb} alt="" />
              </div>
            {/each}
            <div class="bubble-badge">
              <SparkleIcon />
              <span class="bold small">{group.frames.length}</span>
            </div>
          </div>
        {:else}
          <CrossOriginImage src={group.story.media.poster.url.thumb} alt="" />
          {#if group.story.milestone}
            <div class="bubble-badge is-milestone">
              <TodayMilestoneIcon milestone={group.story.milestone} />
            </div>
          {/if}
        {/if}
      </div>

      {#if faces.length > 0}
        <div class="bubble-faces">
          {#each faces as user (user.key)}
            <CrossOriginImage src={user.avatar.url} alt="" />
          {/each}
        </div>
      {/if}
    </div>

    <p class="small ellipsis bubble-title">{title}</p>
  </div>
</Link>

<style lang="scss">
  .trakt-today-story-bubble {
    --bubble-width: var(--ni-80);
    --bubble-height: var(--ni-104);
    --ring-background: conic-gradient(
      from 210deg,
      var(--purple-300),
      var(--purple-600),
      var(--purple-400),
      var(--purple-300)
    );

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);

    width: var(--bubble-width);

    &.is-seen {
      --ring-background: var(--color-border);
    }

    .bubble-ring {
      position: relative;
      box-sizing: border-box;

      width: var(--bubble-width);
      height: var(--bubble-height);
      padding: var(--border-thickness-xs);

      border-radius: var(--border-radius-l);
      background: var(--ring-background);
    }

    .bubble-inner {
      position: relative;
      box-sizing: border-box;
      height: 100%;
      padding: var(--ni-2);

      border-radius: calc(var(--border-radius-l) - var(--ni-2));
      background: var(--color-background);

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--border-radius-m);
      }
    }

    .bubble-for-you {
      position: relative;
      overflow: hidden;

      height: 100%;

      border-radius: var(--border-radius-m);
      background: var(--shade-900);
    }

    .for-you-backdrop {
      position: absolute;
      inset: 0;
      opacity: 0.6;

      :global(img) {
        filter: blur(var(--ni-8)) brightness(0.6);
        transform: scale(1.3);
      }
    }

    .for-you-poster {
      position: absolute;
      top: 50%;
      left: 50%;

      width: 60%;
      aspect-ratio: 2 / 3;

      transform: translate(-50%, -50%)
        translateX(calc(var(--stack-offset) * 30%))
        rotate(calc(var(--stack-offset) * 10deg));

      border-radius: var(--border-radius-s);
      box-shadow: var(--shadow-base);

      :global(img) {
        border-radius: var(--border-radius-s);
      }
    }

    .bubble-badge {
      position: absolute;
      top: var(--ni-4);
      inset-inline-end: var(--ni-4);

      display: flex;
      align-items: center;
      gap: var(--gap-xxs);

      padding: var(--ni-2) var(--ni-6);
      border-radius: var(--border-radius-xxl);

      background: color-mix(in srgb, var(--shade-1000) 75%, transparent);
      color: var(--shade-10);

      :global(svg) {
        width: var(--ni-10);
        height: var(--ni-10);
      }

      span {
        color: inherit;
      }

      &.is-milestone {
        top: var(--ni-6);
        inset-inline-end: var(--ni-6);
        padding: var(--ni-4);

        background: var(--purple-500);

        :global(svg) {
          width: var(--ni-14);
          height: var(--ni-14);
        }
      }
    }

    .bubble-faces {
      position: absolute;
      bottom: calc(-1 * var(--ni-10));
      left: 50%;
      transform: translateX(-50%);

      display: flex;

      :global(img) {
        width: var(--ni-22);
        height: var(--ni-22);
        margin-inline-end: calc(-1 * var(--ni-6));

        border: var(--border-thickness-xs) solid var(--color-background);
        border-radius: 50%;
      }
    }

    .bubble-title {
      max-width: 100%;
      margin-top: var(--ni-4);
    }
  }
</style>
