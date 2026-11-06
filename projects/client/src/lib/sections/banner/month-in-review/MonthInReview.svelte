<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { useActionToast } from "$lib/features/action-toast/useActionToast.ts";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { dropIn } from "$lib/utils/transitions/dropIn.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { untrack } from "svelte";
  import BannerContainer from "../_internal/BannerContainer.svelte";
  import MonthInReviewPosterFan from "./_internal/MonthInReviewPosterFan.svelte";
  import { useMonthInReviewPosters } from "./_internal/useMonthInReviewPosters.ts";
  import { useMonthInReviewShine } from "./_internal/useMonthInReviewShine.ts";

  const {
    isVisible,
    month,
    hiddenUntil,
    onDismiss,
    onRestore,
  }: {
    isVisible: boolean;
    month: Date;
    hiddenUntil: Date;
    onDismiss: () => void;
    onRestore: () => void;
  } = $props();

  const ENTER_MS = 280;
  const LEAVE_MS = 200;

  const { user } = useUser();
  const { track } = useTrack(AnalyticsEvent.Link);
  const { notify } = useActionToast();
  const { posters } = useMonthInReviewPosters(fromRune(() => month));
  const { shouldShine } = useMonthInReviewShine(untrack(() => month));
  const prefersReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const monthName = $derived(toHumanMonth(month, languageTag()));
  const hiddenUntilName = $derived(toHumanMonth(hiddenUntil, languageTag()));
  const href = $derived(
    UrlBuilder.users($user.slug).monthInReview(
      month.getFullYear(),
      month.getMonth() + 1,
    ),
  );

  const onclick = () => track({ target: href, source: "mir-strip" });

  const hide = () => {
    onDismiss();
    notify({
      message: m.mir_entry_hidden_until({ month: hiddenUntilName }),
      action: {
        text: m.button_text_undo(),
        label: m.button_text_undo(),
        onAction: onRestore,
      },
    });
  };
</script>

{#if isVisible}
  <div
    class="trakt-month-in-review-slot"
    in:dropIn|global={{
      axis: "y",
      duration: $prefersReducedMotion ? 0 : ENTER_MS,
    }}
    out:dropIn={{ axis: "y", duration: $prefersReducedMotion ? 0 : LEAVE_MS }}
  >
    <BannerContainer>
      <div class="trakt-month-in-review" data-shine={shouldShine}>
        <span class="strip-shine" aria-hidden="true"></span>

        <Link
          {href}
          {onclick}
          label={m.button_label_month_in_review({ month: monthName })}
          color="inherit"
        >
          <MonthInReviewPosterFan posters={$posters} shape="poster" />
          <span class="strip-copy">
            <span class="tag bold uppercase strip-kicker">
              {m.button_text_month_in_review({ month: monthName })}
            </span>
            <span class="bold strip-title">{m.mir_strip_title()}</span>
          </span>
        </Link>

        <ActionButton
          style="ghost"
          label={m.mir_entry_hide_until({ month: hiddenUntilName })}
          onclick={hide}
        >
          <CloseIcon />
        </ActionButton>
      </div>
    </BannerContainer>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-in-review-slot {
    display: flex;
    flex-direction: column;
  }

  .trakt-month-in-review {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    box-sizing: border-box;
    width: 100%;
    height: var(--ni-64);
    padding-inline-end: var(--ni-4);

    border-radius: var(--border-radius-xl);
    background: var(--background-mir-strip);
    box-shadow: var(--shadow-today-entry);
    color: var(--color-text-primary);

    transition:
      scale var(--transition-increment) ease,
      box-shadow var(--transition-increment) ease-in-out;

    &:has(:global(.trakt-link:active)) {
      scale: 0.98;
    }

    @include for-mouse {
      &:has(:global(.trakt-link:hover)) {
        --poster-fan-step: var(--ni-24);
        --poster-fan-tilt: 12deg;

        box-shadow: var(--shadow-today-entry-hover);
      }
    }

    :global(.trakt-link) {
      flex: 1;
      min-width: 0;
      align-self: stretch;

      display: flex;
      align-items: center;
      gap: var(--gap-l);

      padding-inline-start: var(--ni-12);
      color: inherit;
      text-decoration: none;
    }

    :global(.trakt-action-button) {
      opacity: 0.6;
      transition: opacity var(--transition-increment) ease;

      &:hover,
      &:focus-visible {
        opacity: 1;
      }
    }

    .strip-kicker {
      color: var(--color-mir-accent);
      letter-spacing: 0.14em;
    }

    &[data-shine="true"] .strip-shine::before {
      animation: mir-strip-shine var(--mir-shine-duration, 1100ms)
        cubic-bezier(0.2, 0.7, 0.3, 1) var(--mir-shine-delay, 700ms) 1 both;

      @media (prefers-reduced-motion: reduce) {
        animation: none;
      }
    }
  }

  .strip-shine {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    border-radius: inherit;

    &::before {
      content: "";
      position: absolute;
      inset-block: -40%;
      inset-inline-start: -40%;
      width: 30%;

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

  .strip-copy {
    flex: 1;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    line-height: 1;
  }

  .strip-kicker,
  .strip-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @keyframes mir-strip-shine {
    0% {
      opacity: 0;
      transform: translateX(0) skewX(-20deg);
    }
    15% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateX(calc(var(--rtl-sign) * 500%)) skewX(-20deg);
    }
  }
</style>
