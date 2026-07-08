<script lang="ts">
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toUserRating } from "$lib/utils/formatting/number/toUserRating";
  import { summaryDrawerNavigation } from "../../../_internal/summaryDrawerNavigation";
  import type { SocialActivityEntry } from "../models/SocialActivityEntry";

  const { activity }: { activity: SocialActivityEntry } = $props();

  const { buildReviewDrawerLink } = summaryDrawerNavigation();

  const watchTimeLabel = $derived(
    activity.type === "watch" && activity.minutesWatched
      ? toHumanDuration({ minutes: activity.minutesWatched }, languageTag())
      : null,
  );

  const tagText = $derived.by(() => {
    switch (activity.type) {
      case "review":
        return m.tag_text_reviewed();
      case "rating":
        return toUserRating(activity.rating, getLocale());
      case "watchlist":
        return m.tag_text_watchlisted();
      case "watch":
        return activity.playCount === 1
          ? m.tag_text_watched()
          : m.tag_text_plays({ number: activity.playCount });
    }
  });
</script>

{#snippet tag()}
  <StemTag>
    {#if watchTimeLabel}
      <p class="bold no-wrap">{watchTimeLabel}</p>
      <span class="trakt-social-activity-play-count capitalize tag no-wrap">
        · {tagText}
      </span>
    {:else}
      <p class="bold capitalize no-wrap">{tagText}</p>
    {/if}

    {#if activity.type === "rating"}
      <span class="trakt-social-activity-icon">
        <StarIcon fill="full" />
      </span>
    {/if}
  </StemTag>
{/snippet}

{#if activity.type === "review"}
  <span class="trakt-social-activity-link">
    <Link
      {...buildReviewDrawerLink(activity.reviewId)}
      color="inherit"
      label={m.link_label_open_review({ user: activity.author })}
    >
      {@render tag()}
    </Link>
  </span>
{:else}
  {@render tag()}
{/if}

<style>
  .trakt-social-activity-link {
    display: inline-flex;

    :global(.trakt-link) {
      text-decoration: none;
    }
  }

  .trakt-social-activity-play-count {
    opacity: var(--de-emphasized-opacity);
  }

  .trakt-social-activity-icon {
    display: inline-flex;
    width: var(--ni-12);
    height: var(--ni-12);

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }
</style>
