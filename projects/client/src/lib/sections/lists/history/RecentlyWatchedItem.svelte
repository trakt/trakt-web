<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
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
  import { NOOP_FN } from "$lib/utils/constants";
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

{#snippet action()}
  {#if userRating}
    <UserRating rating={userRating} />
  {:else}
    <RenderFor audience="authenticated">
      <Popover content={rateContent}>
        <ActionButton
          style="ghost"
          size="small"
          onclick={NOOP_FN}
          label={m.button_label_rate({ title: targetTitle })}
        >
          <StarIcon fill="none" />
        </ActionButton>
      </Popover>
    </RenderFor>
  {/if}
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

<style>
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
