<script lang="ts">
  import WatchedTag from "$lib/components/media/tags/WatchedTag.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser.ts";
  import MediaSummaryCard from "$lib/sections/lists/components/MediaSummaryCard.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import type { TodayPersonAction } from "../models/TodayPersonAction.ts";
  import TodayCommentBubble from "./TodayCommentBubble.svelte";
  import TodayMilestoneChip from "./TodayMilestoneChip.svelte";
  import { hasWatchedToo } from "./hasWatchedToo.ts";

  const { action }: { action: TodayPersonAction } = $props();

  const { history } = useUser();

  const isWatchedToo = $derived(
    hasWatchedToo({ history: $history, media: action.media }),
  );
  const show = $derived("totalRuntime" in action.media ? action.media : null);
  const movie = $derived("totalRuntime" in action.media ? null : action.media);
</script>

{#snippet badge()}
  <div class="entry-badge">
    {#if action.rating != null}
      <UserRating rating={action.rating} />
    {/if}
    <UserProfileLink user={action.user} />
    <UserAvatar user={action.user} size="small" />
  </div>
{/snippet}

{#snippet milestoneTag()}
  {#if action.milestone}
    <TodayMilestoneChip milestone={action.milestone} />
  {/if}
{/snippet}

{#snippet watchedTag()}
  <WatchedTag />
{/snippet}

<div class="trakt-today-feed-entry">
  {#if action.episode && show}
    <MediaSummaryCard
      layout="compact"
      type="episode"
      variant="activity"
      activityType="social"
      date={action.activityAt}
      episode={action.episode}
      media={{ ...show, episode: { count: 0 } }}
      {badge}
      tag={action.milestone ? milestoneTag : undefined}
      contextualTag={action.milestone ? milestoneTag : undefined}
      indicators={isWatchedToo ? watchedTag : undefined}
    />
  {:else if action.season && show}
    <MediaSummaryCard
      layout="compact"
      type="season"
      season={action.season}
      media={show}
      {badge}
      tag={action.milestone ? milestoneTag : undefined}
      contextualTag={action.milestone ? milestoneTag : undefined}
      indicators={isWatchedToo ? watchedTag : undefined}
    />
  {:else if movie}
    <MediaSummaryCard
      layout="compact"
      type="movie"
      variant="activity"
      activityType="social"
      date={action.activityAt}
      media={movie}
      {badge}
      indicators={isWatchedToo ? watchedTag : undefined}
    />
  {:else if show}
    <MediaSummaryCard
      layout="compact"
      type="show"
      variant="activity"
      activityType="social"
      date={action.activityAt}
      media={show}
      {badge}
      tag={action.milestone ? milestoneTag : undefined}
      contextualTag={action.milestone ? milestoneTag : undefined}
      indicators={isWatchedToo ? watchedTag : undefined}
    />
  {/if}

  {#if action.comment}
    <TodayCommentBubble comment={action.comment} lines={3} />
  {/if}
</div>

<style>
  .trakt-today-feed-entry {
    --width-override-card: 100%;

    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    .entry-badge {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--gap-xs);
      width: 100%;
    }
  }
</style>
