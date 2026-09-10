<script lang="ts">
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import Popover from "$lib/components/popover/Popover.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import RemoveFromHistoryAction from "$lib/sections/media-actions/remove-from-history/RemoveFromHistoryAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import RateNow from "$lib/sections/summary/components/rating/RateNow.svelte";
  import type { RateNowProps } from "$lib/sections/summary/components/rating/models/RateNowProps";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
  import ActivityItem from "../components/ActivityItem.svelte";
  import ActivitySummaryCard from "../components/ActivitySummaryCard.svelte";
  import type { HistoryEntry } from "../stores/models/HistoryEntry";

  type RecentlyWatchedItemProps = {
    media: HistoryEntry;
    isActionable?: boolean;
    style?: "summary" | "cover";
  };

  const {
    media: activity,
    style = "cover",
    isActionable = false,
  }: RecentlyWatchedItemProps = $props();

  const { ratings } = useUser();

  const userRating = $derived.by(() => {
    const data =
      activity.type === "episode"
        ? $ratings?.episodes.get(activity.episode.id)
        : $ratings?.movies.get(activity.movie.id);

    return data?.rating;
  });

  const rateTarget = $derived<RateNowProps>(
    activity.type === "episode"
      ? {
          type: "episode",
          media: activity.episode,
          show: activity.show,
        }
      : {
          type: "movie",
          media: activity.movie,
        },
  );

  const activityType = $derived(isActionable ? "personal" : "social");

  const targetTitle = $derived.by(() => {
    if (activity.type === "episode") {
      return episodeActivityTitle(activity.episode);
    }

    return activity.movie.title;
  });

  const rateLabel = $derived(
    userRating
      ? m.button_label_change_rating({ title: targetTitle })
      : m.button_label_rate({ title: targetTitle }),
  );
</script>

{#snippet popupActions()}
  <RenderFor audience="authenticated">
    {#if activity.type === "episode"}
      <RemoveFromHistoryAction
        style="dropdown-item"
        title={activity.episode.title}
        entry={activity}
      />
    {:else}
      <WatchlistAction
        style="dropdown-item"
        title={activity.movie.title}
        type={activity.movie.type}
        media={activity.movie}
      />
      <RemoveFromHistoryAction
        style="dropdown-item"
        title={activity.movie.title}
        entry={activity}
      />
    {/if}
  </RenderFor>
{/snippet}

{#snippet rateContent()}
  <div class="trakt-history-rate-popover">
    <RateNow {...rateTarget} variant="allow" />
  </div>
{/snippet}

<!--
  Rated and unrated share one <Popover> and one trigger, so the element survives
  a rating landing while the popover is open - the badge swaps in without the
  popover unmounting under the user's cursor - and both states get the same
  press affordance.
-->
{#snippet action()}
  <RenderFor audience="authenticated">
    <Popover content={rateContent} label={rateLabel}>
      <span
        class="trakt-history-rating-badge"
        class:is-rated={Boolean(userRating)}
      >
        {#if userRating}
          <UserRating rating={userRating} />
        {:else}
          <StarIcon fill="none" />
        {/if}
      </span>
    </Popover>
  </RenderFor>
{/snippet}

{#if style === "cover"}
  <ActivityItem
    activityAt={activity.watchedAt}
    {activity}
    popupActions={isActionable ? popupActions : undefined}
    action={isActionable ? action : undefined}
    source="watch-history"
    {activityType}
  />
{/if}

{#if style === "summary"}
  <ActivitySummaryCard
    activityAt={activity.watchedAt}
    {activity}
    popupActions={isActionable ? popupActions : undefined}
    badge={isActionable ? action : undefined}
    source="watch-history"
    {activityType}
  />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  /*
    Negative margins cancel the hit-area padding so the badge keeps the exact
    position it had as a read-only tag; only the wash grows.
  */
  .trakt-history-rating-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    color: var(--color-foreground);

    padding: var(--ni-6);
    margin: var(--ni-neg-6);
    border-radius: var(--border-radius-m);

    transition: var(--transition-increment) ease-in-out;
    transition-property: background-color, transform;

    /*
      Unrated shows a lone star, so it is sized here rather than by UserRating.
      Guarded on :not(.is-rated) so the rule can never reach the rated badge's
      own icon, which UserRating sizes.
    */
    &:not(.is-rated) :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }

    @include for-mouse() {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 10%,
          transparent
        );
      }
    }

    &:active {
      transform: scale(0.92);
    }
  }

  .trakt-history-rate-popover {
    padding: var(--ni-12) var(--ni-16);
    border-radius: var(--border-radius-l);
    background-color: var(--color-modal-background);
    box-shadow: var(--shadow-menu);

    :global(svg) {
      --icon-color: var(--color-text-primary);
    }

    :global(.is-current-rating svg) {
      --icon-fill-color: var(--color-text-primary);
    }
  }
</style>
