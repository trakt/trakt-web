<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import { dedupe } from "$lib/utils/array/dedupe.ts";
  import { isStorySeen } from "./_internal/isStorySeen.ts";
  import TodayFaces from "./_internal/TodayFaces.svelte";
  import { todayStoryNavigation } from "./_internal/todayStoryNavigation.ts";
  import { toFrameMedia } from "./_internal/toFrameMedia.ts";
  import { toStoryGroups } from "./_internal/toStoryGroups.ts";
  import { useTodaySeenStories } from "./useTodaySeenStories.ts";
  import { useTodayStories } from "./useTodayStories.ts";

  const MAX_FACES = 3;
  const MAX_POSTERS = 2;


  const { filterMap } = useFilter();
  const { titles, forYou } = $derived(
    useTodayStories({ type: "media", filter: $filterMap }),
  );
  const { seenStories } = useTodaySeenStories();
  const { storyLink } = todayStoryNavigation();

  const groups = $derived(
    toStoryGroups({ forYou: $forYou ?? [], titles: $titles ?? [] }),
  );
  const unseen = $derived(
    groups.filter(
      (group) => !isStorySeen({ group, seenStories: $seenStories }),
    ),
  );
  const target = $derived(unseen.at(0) ?? groups.at(0));
  const link = $derived(target ? storyLink(target.key) : null);

  const faces = $derived(
    dedupe(
      (user) => user.key,
      groups.flatMap((group) =>
        group.type === "title" ? group.story.users : [],
      ),
    ).slice(0, MAX_FACES),
  );
  const posters = $derived(
    dedupe(
      (media) => media.key,
      groups.flatMap((group) => {
        const frame = group.frames.at(0);
        return frame ? [toFrameMedia(frame)] : [];
      }),
    ).slice(0, MAX_POSTERS),
  );
</script>

{#if link}
  <div class="trakt-today-navbar-entry" data-seen={unseen.length === 0}>
    <Link
      href={link.href}
      noscroll={link.noscroll}
      replacestate={link.replacestate}
      label={m.button_label_open_today_stories()}
      navigationType={DpadNavigationType.Item}
      color="inherit"
    >
      <div class="entry-ring">
        <span class="entry-glow" aria-hidden="true"></span>
        <span class="entry-spin" aria-hidden="true"></span>
        <div class="entry-body">
          <span class="entry-sheen" aria-hidden="true"></span>
          <div class="entry-posters">
            {#each posters as poster (poster.key)}
              <div class="entry-poster">
                <CrossOriginImage src={poster.poster.url.thumb} alt="" />
              </div>
            {/each}
          </div>

          <div class="entry-faces">
            <TodayFaces users={faces} size="small" />
          </div>

          <span class="bold entry-label">{m.list_title_today()}</span>

          {#if unseen.length > 0}
            <span class="bold entry-badge">{unseen.length}</span>
          {/if}
        </div>
      </div>
    </Link>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-navbar-entry {
    --entry-ring: conic-gradient(
      from 210deg,
      var(--purple-300),
      var(--purple-600),
      var(--purple-400),
      var(--purple-300)
    );
    --entry-size: var(--ni-40);
    --entry-cycle: calc(var(--transition-duration-short) * 20);
    --entry-cycle-delay: calc(var(--transition-duration-short) * 3);
    --entry-cycle-count: 3;

    display: flex;

    &[data-seen="true"] {
      --entry-ring: var(--color-border);
    }

    .entry-ring {
      position: relative;
      isolation: isolate;

      display: inline-flex;
      box-sizing: border-box;
      height: var(--entry-size);
      padding: var(--border-thickness-xs);

      border-radius: var(--border-radius-xxl);
      background: var(--entry-ring);
    }

    .entry-glow,
    .entry-spin,
    .entry-sheen {
      display: none;
      pointer-events: none;
    }

    &[data-seen="false"] {
      .entry-ring {
        background: none;
      }

      .entry-glow {
        display: block;
        position: absolute;
        inset: calc(-1 * var(--ni-2));
        z-index: -1;

        border-radius: inherit;
        background: var(--entry-ring);
        filter: blur(var(--ni-8));
        opacity: 0.35;

        animation: today-entry-breathe calc(var(--transition-duration-short) * 12)
          ease-in-out infinite alternate;
      }

      .entry-spin,
      .entry-sheen {
        display: block;
        position: absolute;
        inset: 0;
        overflow: hidden;

        border-radius: inherit;
      }

      .entry-spin {
        &::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150%;
          aspect-ratio: 1;

          background: var(--entry-ring);
          transform: translate(-50%, -50%);
          animation: today-entry-spin calc(var(--transition-duration-short) * 30)
            linear infinite;
        }
      }

      .entry-sheen {
        &::before {
          content: "";
          position: absolute;
          inset-block: 0;
          left: 0;
          width: 40%;

          background: linear-gradient(
            100deg,
            transparent,
            color-mix(in srgb, var(--purple-200) 30%, transparent),
            transparent
          );
          transform: translateX(-120%);

          animation: today-entry-sheen var(--entry-cycle) ease-in-out
            var(--entry-cycle-delay) var(--entry-cycle-count);
        }
      }

      .entry-badge {
        animation: today-entry-pop var(--entry-cycle) ease-out
          var(--entry-cycle-delay) var(--entry-cycle-count);

        &::after {
          content: "";
          position: absolute;
          inset: 0;

          border: var(--border-thickness-xs) solid var(--purple-300);
          border-radius: inherit;
          opacity: 0;

          animation: today-entry-ripple var(--entry-cycle) ease-out
            var(--entry-cycle-delay) var(--entry-cycle-count);
        }
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .entry-glow,
      .entry-spin::before,
      .entry-sheen::before,
      .entry-badge,
      .entry-badge::after {
        animation: none;
      }
    }

    .entry-body {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      padding-inline: var(--ni-8) var(--ni-12);

      border-radius: var(--border-radius-xxl);
      background: var(--color-background);
      color: var(--color-text-primary);
    }

    .entry-posters {
      display: none;
    }

    .entry-faces {
      display: flex;
      padding-inline-start: var(--ni-4);
    }

    .entry-label {
      color: inherit;
    }

    .entry-badge {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      min-width: var(--ni-22);
      height: var(--ni-22);
      padding-inline: var(--ni-6);
      box-sizing: border-box;

      border-radius: var(--border-radius-xxl);
      background: var(--purple-500);
      color: var(--shade-10);
      font-size: var(--font-size-tag);
    }

    @include for-mobile {
      .entry-ring {
        width: var(--entry-size);
      }

      .entry-body {
        position: relative;
        justify-content: center;
        width: 100%;
        padding-inline: 0;
      }

      .entry-posters {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .entry-poster {
        position: absolute;

        width: var(--ni-14);
        height: var(--ni-20);

        :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--ni-3);
        }

        &:first-child {
          transform: translateX(calc(var(--rtl-sign) * var(--ni-6) * -1))
            rotate(-10deg);
        }

        &:last-child:not(:first-child) {
          transform: translateX(calc(var(--rtl-sign) * var(--ni-6)))
            rotate(10deg);
        }
      }

      .entry-faces,
      .entry-label {
        display: none;
      }

      .entry-badge {
        position: absolute;
        top: calc(-1 * var(--ni-6));
        inset-inline-end: calc(-1 * var(--ni-6));

        min-width: var(--ni-18);
        height: var(--ni-18);
        padding-inline: var(--ni-4);

        border: var(--border-thickness-xs) solid var(--color-background);
      }
    }
  }

  @keyframes today-entry-spin {
    to {
      transform: translate(-50%, -50%) rotate(1turn);
    }
  }

  @keyframes today-entry-breathe {
    from {
      opacity: 0.25;
    }
    to {
      opacity: 0.6;
    }
  }

  @keyframes today-entry-pop {
    0%,
    70%,
    82%,
    100% {
      transform: scale(1);
    }
    75% {
      transform: scale(1.22);
    }
  }

  @keyframes today-entry-ripple {
    0%,
    70% {
      opacity: 0;
      transform: scale(1);
    }
    71% {
      opacity: 0.8;
      transform: scale(1);
    }
    84%,
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }

  @keyframes today-entry-sheen {
    0%,
    70% {
      transform: translateX(-120%);
    }
    100% {
      transform: translateX(300%);
    }
  }
</style>
