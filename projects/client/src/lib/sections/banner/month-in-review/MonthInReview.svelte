<script lang="ts">
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import DismissButton from "../_internal/DismissButton.svelte";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  const { month, onDismiss }: { month: Date; onDismiss: () => void } = $props();
  const { user } = useUser();

  const monthName = $derived(toHumanMonth(month, languageTag()));
  const href = $derived(
    UrlBuilder.users($user.slug).monthInReview(
      month.getFullYear(),
      month.getMonth() + 1,
    ),
  );
</script>

<div class="trakt-month-in-review">
  <div class="mir-pill">
    <span class="mir-month bold">{monthName}</span>
    <span class="mir-in-review">{m.mir_banner_in_review()}</span>
  </div>

  <p class="mir-body ellipsis">{m.mir_banner_body({ month: monthName })}</p>

  <div class="mir-actions">
    <a class="mir-explore bold" {href}>
      <span class="explore-label-desktop">{m.mir_banner_explore()}</span>
      <span class="explore-label-mobile">{m.mir_banner_explore_now()}</span>
    </a>
    <DismissButton {onDismiss} />
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-month-in-review {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: var(--ni-920);
    height: var(--ni-52);

    background: var(--color-mir-banner-base);
    border: 1px solid
      color-mix(in srgb, var(--color-review-foreground) 8%, transparent);
    border-radius: var(--border-radius-l);
    box-shadow: 0 var(--ni-4) var(--ni-24) rgba(0, 0, 0, 0.4);
    overflow: hidden;
  }

  .mir-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--ni-1);

    flex-shrink: 0;
    align-self: stretch;
    min-width: var(--ni-80);
    padding-inline: var(--gap-s);

    background: var(--purple-600);
  }

  .mir-month {
    font-size: var(--font-size-text);
    line-height: 1.1;
    color: var(--color-review-foreground);
    white-space: nowrap;
  }

  .mir-in-review {
    font-size: var(--font-size-text-small);
    color: color-mix(in srgb, var(--color-review-foreground) 60%, transparent);
    white-space: nowrap;
  }

  .mir-body {
    flex: 1 1 0;
    min-width: 0;
    padding-inline: var(--gap-m);

    font-size: var(--font-size-text);
    color: color-mix(in srgb, var(--color-review-foreground) 85%, transparent);
    text-align: center;
  }

  .mir-actions {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    flex-shrink: 0;
    align-self: stretch;
    padding-inline: var(--gap-m);
  }

  // Ghost-outlined CTA: transparent fill, subtle light stroke, accent label.
  .mir-explore {
    display: inline-flex;
    align-items: center;
    padding: var(--gap-xs) var(--gap-m);

    color: var(--purple-300);
    text-decoration: none;
    font-size: var(--font-size-text);
    white-space: nowrap;

    background: transparent;
    border: 1px solid color-mix(in srgb, var(--purple-300) 45%, transparent);
    border-radius: var(--border-radius-s);
    transition: background 150ms ease, border-color 150ms ease;

    &:hover {
      background: color-mix(in srgb, var(--purple-300) 12%, transparent);
      border-color: color-mix(in srgb, var(--purple-300) 70%, transparent);
    }
  }

  .mir-actions :global(trakt-banner-dismiss-button) {
    opacity: 0.5;
    transition: opacity 150ms ease;

    &:hover {
      opacity: 0.9;
    }
  }

  .explore-label-mobile {
    display: none;
  }

  // Mobile has no room for the recap copy, so drop it entirely and keep just
  // the month chip and the actions, which sit at the end. The CTA also gets
  // the more emphatic "Explore Now" label here.
  @include for-tablet-sm-and-below {
    .mir-body {
      display: none;
    }

    .mir-actions {
      margin-inline-start: auto;
    }

    .explore-label-desktop {
      display: none;
    }

    .explore-label-mobile {
      display: inline;
    }
  }
</style>
