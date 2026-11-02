<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useFilter } from "$lib/features/filters/useFilter.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { dedupe } from "$lib/utils/array/dedupe.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
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
  const { track } = useTrack(AnalyticsEvent.Link);
  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  const trackTooltipLink = (target: string) => () =>
    track({ target, source: "today-navbar-tooltip" });

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
  {#snippet tooltip()}
    <div class="entry-tooltip">
      <p class="small">{m.today_entry_tooltip_body()}</p>
      <div class="entry-tooltip-actions">
        <Link
          href={link.href}
          noscroll={link.noscroll}
          replacestate={link.replacestate}
          onclick={trackTooltipLink("today-story")}
          color="inherit"
        >
          <span class="small bold">{m.today_entry_open()}</span>
          <CaretRightIcon />
        </Link>
        <Button
          href={UrlBuilder.today()}
          size="small"
          style="ghost"
          color="default"
          label={m.button_label_view_all_today()}
          onclick={trackTooltipLink(UrlBuilder.today())}
        >
          {m.today_entry_see_all()}
        </Button>
      </div>
    </div>
  {/snippet}

  <div
    class="trakt-today-navbar-entry"
    class:has-faces={faces.length > 0}
    class:has-count={unseen.length > 0}
    data-seen={unseen.length === 0}
  >
    <Tooltip
      content={tooltip}
      side="bottom"
      sideOffset={10}
      disabled={!$isMouse}
    >
      <Link
        href={link.href}
        noscroll={link.noscroll}
        replacestate={link.replacestate}
        label={m.button_label_open_today_stories()}
        navigationType={DpadNavigationType.Item}
        color="inherit"
      >
        <span class="entry-shine" aria-hidden="true"></span>

        <span class="entry-posters">
          {#each posters as poster (poster.key)}
            <span class="entry-poster">
              <CrossOriginImage src={poster.poster.url.thumb} alt="" />
            </span>
          {/each}
        </span>

        {#if faces.length > 0}
          <span class="entry-faces">
            <TodayFaces users={faces} size="small" />
          </span>
        {/if}

        <span class="entry-label">{m.list_title_today()}</span>

        {#if unseen.length > 0}
          <span class="bold entry-badge">{unseen.length}</span>
        {/if}
      </Link>
    </Tooltip>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-navbar-entry {
    --entry-inset-start: var(--ni-12);
    --entry-inset-end: var(--ni-12);
    --entry-shine-cycle: 60s;
    --entry-shine-delay: 3s;

    position: relative;
    display: grid;
    min-width: 0;
    border-radius: inherit;

    &.has-faces {
      --entry-inset-start: var(--ni-3);
    }

    &.has-count {
      --entry-inset-end: calc(
        (var(--navbar-entry-size) - var(--navbar-entry-chip-size)) / 2
      );
    }

    :global(.trakt-tooltip-trigger) {
      min-width: 0;
      border-radius: inherit;
    }

    :global(.trakt-tooltip-trigger > .trakt-link) {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-xs);

      box-sizing: border-box;
      min-width: 0;
      height: var(--navbar-entry-size);
      padding-inline: var(--entry-inset-start) var(--entry-inset-end);

      border-radius: inherit;
      text-decoration: none;
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

        :global(.is-hidden) & {
          animation-play-state: paused;
        }

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
      white-space: nowrap;
    }

    .entry-badge {
      display: flex;
      align-items: center;
      justify-content: center;

      min-width: var(--navbar-entry-chip-size);
      height: var(--navbar-entry-chip-size);
      padding-inline: var(--ni-6);
      box-sizing: border-box;

      border-radius: var(--border-radius-pill);
      background: var(--color-navbar-entry-chip-background);
      box-shadow: inset 0 0 0 var(--border-thickness-xxs)
        var(--color-navbar-entry-chip-ring);
      color: var(--color-navbar-entry-chip-text);
      font-size: var(--font-size-tag);
      font-variant-numeric: tabular-nums;
    }

    @include for-mobile {
      :global(.trakt-tooltip-trigger > .trakt-link) {
        justify-content: center;
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
            var(--color-navbar-entry-chip-background),
            var(--color-navbar-entry-chip-background)
          ),
          var(--color-background);
      }
    }
  }

  .entry-tooltip {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
    width: var(--ni-240);
    max-width: 100%;

    p {
      line-height: 1.45;
      text-wrap: pretty;
    }
  }

  .entry-tooltip-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--ni-4);

      color: var(--color-today-entry-accent);
      text-decoration: none;

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
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
