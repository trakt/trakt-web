<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import ExternalLinkIcon from "$lib/components/icons/ExternalLinkIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanMonth } from "$lib/utils/formatting/date/toHumanMonth";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const {
    slug,
    date,
    source,
    variant = "link",
  }: {
    slug: string;
    date: Date;
    source: string;
    variant?: "button" | "link";
  } = $props();

  const year = $derived(date.getFullYear());
  const month = $derived(date.getMonth() + 1);
  const previousMonth = $derived(toHumanMonth(date, languageTag()));

  const href = $derived(UrlBuilder.users(slug).monthInReview(year, month));
  const { track } = useTrack(AnalyticsEvent.Link);

  const onclick = () => {
    track({ target: href, source });
  };
</script>

<div class="trakt-month-in-review-link">
  {#if variant === "link"}
    <Link {href} {onclick}>
      <ExternalLinkIcon />
      <p class="uppercase bold">{previousMonth}</p>
    </Link>
  {:else}
    <Button
      {href}
      {onclick}
      label={m.button_label_month_in_review({ month: previousMonth })}
      size="small"
    >
      <p class="capitalize">
        {m.button_text_month_in_review({ month: previousMonth })}
      </p>
      {#snippet icon()}<CaretRightIcon />{/snippet}
    </Button>
  {/if}
</div>

<style>
  .trakt-month-in-review-link {
    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      color: var(--shade-10);

      :global(svg) {
        color: var(--shade-10);
      }
    }

    :global(svg) {
      width: var(--ni-18);
      height: var(--ni-18);
    }

    :global(.trakt-button-link) {
      border: var(--ni-1) solid var(--color-text-primary);
    }
  }
</style>
