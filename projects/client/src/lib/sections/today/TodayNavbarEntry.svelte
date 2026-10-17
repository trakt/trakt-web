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
      <div
        class="entry-pill"
        class:has-faces={faces.length > 0}
        class:has-count={unseen.length > 0}
      >
        <span class="entry-shine" aria-hidden="true"></span>

        <div class="entry-posters">
          {#each posters as poster (poster.key)}
            <div class="entry-poster">
              <CrossOriginImage src={poster.poster.url.thumb} alt="" />
            </div>
          {/each}
        </div>

        {#if faces.length > 0}
          <div class="entry-faces">
            <TodayFaces users={faces} size="small" />
          </div>
        {/if}

        <span class="entry-label">{m.list_title_today()}</span>

        {#if unseen.length > 0}
          <span class="bold entry-badge">{unseen.length}</span>
        {/if}
      </div>
    </Link>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-navbar-entry {
    --entry-size: var(--segmented-select-segment-height);
    --entry-count-size: var(--ni-20);
    --entry-shine-cycle: 60s;
    --entry-shine-delay: 3s;

    display: flex;

    .entry-pill {
      --entry-inset-start: var(--ni-12);
      --entry-inset-end: var(--ni-12);

      position: relative;
      display: inline-flex;
      align-items: center;
      vertical-align: top;
      gap: var(--gap-xs);

      box-sizing: border-box;
      height: var(--entry-size);
      padding-inline: var(--entry-inset-start) var(--entry-inset-end);

      border-radius: calc(var(--entry-size) / 2);
      background:
        var(--background-today-entry),
        color-mix(in srgb, var(--color-background-navbar) 75%, transparent);
      backdrop-filter: blur(var(--ni-8));
      box-shadow: var(--shadow-today-entry);
      color: var(--color-text-primary);

      transition: box-shadow var(--transition-increment) ease-in-out;

      &.has-faces {
        --entry-inset-start: var(--ni-3);
      }

      &.has-count {
        --entry-inset-end: calc(
          (var(--entry-size) - var(--entry-count-size)) / 2
        );
      }

      @include for-mouse {
        &:hover {
          box-shadow: var(--shadow-today-entry-hover);
        }
      }
    }

    .entry-shine {
      display: none;
      position: absolute;
      inset: 0;
      overflow: hidden;
      box-sizing: border-box;
      padding: var(--border-thickness-xxs);
      pointer-events: none;

      border-radius: inherit;
      mask:
        linear-gradient(black 0 0) content-box,
        linear-gradient(black 0 0);
      mask-composite: exclude;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        width: 150%;
        aspect-ratio: 1;

        background: conic-gradient(
          transparent 0deg,
          var(--color-today-entry-shine) 22deg,
          var(--color-today-entry-shine-core) 32deg,
          var(--color-today-entry-shine) 42deg,
          transparent 66deg
        );
        opacity: 0;
        transform: translate(-50%, -50%) rotate(-40deg);
      }
    }

    &[data-seen="false"] .entry-shine {
      display: block;

      &::before {
        animation: today-entry-shine var(--entry-shine-cycle) linear
          var(--entry-shine-delay) infinite;

        @media (prefers-reduced-motion: reduce) {
          animation: none;
        }
      }
    }

    .entry-posters {
      display: none;
    }

    .entry-faces {
      display: flex;
    }

    .entry-label {
      color: inherit;
      font-weight: 500;
    }

    .entry-badge {
      display: flex;
      align-items: center;
      justify-content: center;

      min-width: var(--entry-count-size);
      height: var(--entry-count-size);
      padding-inline: var(--ni-6);
      box-sizing: border-box;

      border-radius: calc(var(--entry-count-size) / 2);
      background: var(--color-today-entry-count-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        var(--color-today-entry-count-ring);
      color: var(--color-today-entry-count-text);
      font-size: var(--font-size-tag);
      font-variant-numeric: tabular-nums;
    }

    @include for-mobile {
      --entry-count-size: var(--ni-18);

      .entry-pill {
        justify-content: center;
        width: var(--entry-size);
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

        padding-inline: var(--ni-4);

        border: var(--border-thickness-xs) solid var(--color-background);
        background:
          linear-gradient(
            var(--color-today-entry-count-background),
            var(--color-today-entry-count-background)
          ),
          var(--color-background);
      }
    }
  }

  @keyframes today-entry-shine {
    0% {
      opacity: 0;
      transform: translate(-50%, -50%) rotate(-40deg);
    }
    0.6%,
    4.4% {
      opacity: 1;
    }
    5%,
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) rotate(320deg);
    }
  }
</style>
