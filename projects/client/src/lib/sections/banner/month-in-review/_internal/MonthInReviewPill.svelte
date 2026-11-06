<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType.ts";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { dropIn } from "$lib/utils/transitions/dropIn.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { untrack } from "svelte";
  import MonthInReviewPosterFan from "./MonthInReviewPosterFan.svelte";
  import { useMonthInReviewPosters } from "./useMonthInReviewPosters.ts";
  import { useMonthInReviewShine } from "./useMonthInReviewShine.ts";

  const {
    month,
    hiddenUntil,
    onDismiss,
  }: {
    month: Date;
    hiddenUntil: Date;
    onDismiss: () => void;
  } = $props();

  const { user } = useUser();
  const { track } = useTrack(AnalyticsEvent.Link);
  const { posters } = useMonthInReviewPosters(fromRune(() => month));
  const { shouldShine } = useMonthInReviewShine(untrack(() => month));
  const prefersReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const ENTER_MS = 240;
  const LEAVE_MS = 180;

  const monthName = $derived(toHumanMonth(month, languageTag()));
  const hiddenUntilName = $derived(toHumanMonth(hiddenUntil, languageTag()));
  const href = $derived(
    UrlBuilder.users($user.slug).monthInReview(
      month.getFullYear(),
      month.getMonth() + 1,
    ),
  );

  const trackOpen = (source: string) => () => track({ target: href, source });
</script>

{#snippet tooltip()}
  <div class="pill-tooltip">
    <p class="small">{m.mir_entry_tooltip_body({ month: monthName })}</p>
    <div class="pill-tooltip-actions">
      <Link {href} onclick={trackOpen("mir-navbar-tooltip")} color="inherit">
        <span class="small bold">{m.mir_entry_open()}</span>
        <CaretRightIcon />
      </Link>
      <Button
        size="small"
        style="ghost"
        color="default"
        label={m.mir_entry_hide_until({ month: hiddenUntilName })}
        onclick={onDismiss}
      >
        {m.mir_entry_hide_until({ month: hiddenUntilName })}
      </Button>
    </div>
  </div>
{/snippet}

<div
  class="trakt-month-in-review-pill"
  data-shine={shouldShine}
  in:dropIn|global={{
    axis: "x",
    offset: 24,
    duration: $prefersReducedMotion ? 0 : ENTER_MS,
  }}
  out:dropIn|global={{
    axis: "x",
    offset: 24,
    duration: $prefersReducedMotion ? 0 : LEAVE_MS,
  }}
>
  <Tooltip content={tooltip} side="bottom" sideOffset={10}>
    <Link
      {href}
      onclick={trackOpen("mir-navbar-entry")}
      label={m.button_label_month_in_review({ month: monthName })}
      navigationType={DpadNavigationType.Item}
      color="inherit"
    >
      <div class="pill-surface" class:has-posters={$posters.length > 0}>
        <span class="pill-shine" aria-hidden="true"></span>
        <MonthInReviewPosterFan posters={$posters} shape="round" />
        <span class="pill-copy">
          <span class="small bold pill-month">{monthName}</span>
          <span class="tag bold uppercase pill-kicker">
            {m.mir_banner_in_review()}
          </span>
        </span>
      </div>
    </Link>
  </Tooltip>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-in-review-pill {
    --entry-size: var(--segmented-select-segment-height);

    display: flex;

    :global(.trakt-link) {
      display: flex;
      text-decoration: none;
    }
  }

  .pill-surface {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--gap-xs);

    box-sizing: border-box;
    height: var(--entry-size);
    padding-inline: var(--ni-12);

    border-radius: var(--border-radius-pill);
    background:
      var(--background-today-entry),
      color-mix(in srgb, var(--color-background-navbar) 75%, transparent);
    backdrop-filter: blur(var(--ni-8));
    box-shadow: var(--shadow-today-entry);
    color: var(--color-text-primary);

    transition: box-shadow var(--transition-increment) ease-in-out;

    &.has-posters {
      padding-inline-start: var(--ni-3);
    }

    @include for-mouse {
      &:hover {
        --poster-fan-step: var(--ni-18);
        --poster-fan-tilt: 6deg;

        box-shadow: var(--shadow-today-entry-hover);
      }
    }
  }

  .pill-shine {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    border-radius: inherit;

    &::before {
      content: "";
      position: absolute;
      inset-block: -40%;
      inset-inline-start: -60%;
      width: 45%;

      background: linear-gradient(
        90deg,
        transparent,
        var(--color-mir-entry-shine) 50%,
        transparent
      );
      opacity: 0;
      transform: skewX(-20deg);
    }
  }

  .trakt-month-in-review-pill[data-shine="true"] .pill-shine::before {
    animation: mir-entry-shine var(--mir-shine-duration, 1100ms)
      cubic-bezier(0.2, 0.7, 0.3, 1) var(--mir-shine-delay, 700ms) 1 both;

    :global(.is-hidden) & {
      animation-play-state: paused;
    }

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  }

  .pill-copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-2);
    line-height: 1;
  }

  .pill-month {
    white-space: nowrap;
  }

  .pill-kicker {
    color: var(--color-mir-accent);
    letter-spacing: 0.12em;
    white-space: nowrap;
  }

  .pill-tooltip {
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

  .pill-tooltip-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--ni-4);

      color: var(--color-mir-accent);
      text-decoration: none;

      :global(svg) {
        width: var(--ni-12);
        height: var(--ni-12);
      }
    }
  }

  @keyframes mir-entry-shine {
    0% {
      opacity: 0;
      transform: translateX(0) skewX(-20deg);
    }
    15% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateX(calc(var(--rtl-sign) * 400%)) skewX(-20deg);
    }
  }
</style>
