<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp.ts";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import DismissButton from "../_internal/DismissButton.svelte";

  const { month, onDismiss }: { month: Date; onDismiss: () => void } = $props();
  const { user } = useUser();
  const { track } = useTrack(AnalyticsEvent.Link);

  const monthName = $derived(toHumanMonth(month, languageTag()));
  const href = $derived(
    UrlBuilder.users($user.slug).monthInReview(
      month.getFullYear(),
      month.getMonth() + 1,
    ),
  );

  const onclick = () => track({ target: href, source: "mir-banner" });
</script>

{#snippet recap(text: string)}
  <p class="mir-body" use:lineClamp={{ lines: 2 }}>{text}</p>
{/snippet}

<div class="trakt-month-in-review">
  <Link {href} {onclick} color="inherit">
    <div class="mir-pill">
      <span class="mir-month bold">{monthName}</span>
      <span class="mir-in-review">{m.mir_banner_in_review()}</span>
    </div>

    <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
      {@render recap(m.mir_banner_body({ month: monthName }))}
      <span class="mir-cta bold">{m.mir_banner_explore()}</span>
    </RenderFor>

    <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
      {@render recap(m.mir_banner_body_short({ month: monthName }))}
    </RenderFor>
  </Link>

  <DismissButton {onDismiss} />
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
    color: var(--color-mir-banner-foreground);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-mir-banner-foreground) 8%, transparent);
    border-radius: var(--border-radius-l);
    box-shadow: var(--ni-0) var(--ni-4) var(--ni-24) var(--ni-0)
      color-mix(in srgb, var(--color-shadow) 40%, transparent);
    overflow: hidden;

    :global(.trakt-link) {
      flex: 1;
      min-width: 0;

      display: flex;
      align-items: center;
      align-self: stretch;

      color: inherit;
      text-decoration: none;

      @include for-mouse {
        &:hover {
          background: color-mix(
            in srgb,
            var(--color-mir-banner-foreground) 5%,
            transparent
          );
        }
      }
    }
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

    background: var(--color-mir-banner-pill);
  }

  .mir-month {
    font-size: var(--font-size-text);
    line-height: 1.1;
    color: var(--color-mir-banner-foreground);
    white-space: nowrap;
  }

  .mir-in-review {
    font-size: var(--font-size-text-small);
    color: color-mix(in srgb, var(--color-mir-banner-foreground) 75%, transparent);
    white-space: nowrap;
  }

  .mir-body {
    flex: 1 1 0;
    min-width: 0;
    padding-inline: var(--gap-m);

    font-size: var(--font-size-text);
    line-height: 1.35;
    color: color-mix(in srgb, var(--color-mir-banner-foreground) 90%, transparent);
    text-align: center;
  }

  .mir-cta {
    flex-shrink: 0;
    margin-inline-end: var(--gap-s);
    padding: var(--gap-xs) var(--gap-m);

    color: var(--color-mir-banner-accent);
    font-size: var(--font-size-text);
    white-space: nowrap;

    background: transparent;
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-mir-banner-accent) 45%, transparent);
    border-radius: var(--border-radius-s);
    transition: background var(--transition-increment) ease,
      border-color var(--transition-increment) ease;

    @include for-mouse {
      :global(.trakt-link:hover) & {
        background: color-mix(
          in srgb,
          var(--color-mir-banner-accent) 12%,
          transparent
        );
        border-color: color-mix(
          in srgb,
          var(--color-mir-banner-accent) 70%,
          transparent
        );
      }
    }
  }

  .trakt-month-in-review :global(trakt-banner-dismiss-button) {
    flex-shrink: 0;
    padding-inline-end: var(--gap-s);

    opacity: 0.5;
    transition: opacity var(--transition-increment) ease;

    &:hover {
      opacity: 0.9;
    }
  }

  @include for-tablet-sm-and-below {
    .mir-body {
      padding-inline: var(--gap-s);
    }
  }
</style>
