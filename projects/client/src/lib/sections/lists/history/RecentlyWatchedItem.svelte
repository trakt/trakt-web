<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeStatusTag from "$lib/components/episode/tags/EpisodeStatusTag.svelte";
  import ActivityCard from "../components/ActivityCard.svelte";
  import ActivitySummaryCard from "../components/ActivitySummaryCard.svelte";
  import type { HistoryEntry } from "../stores/useRecentlyWatchedList";

  type RecentlyWatchedItemProps = {
    media: HistoryEntry;
    style?: "summary" | "cover";
  };

  const { media: activity, style = "cover" }: RecentlyWatchedItemProps =
    $props();
</script>

{#snippet badges()}
  {#if activity.type === "episode"}
    <EpisodeStatusTag i18n={EpisodeIntlProvider} type={activity.episode.type} />
  {/if}
{/snippet}

{#if style === "cover"}
  <ActivityCard activityAt={activity.watchedAt} {activity} />
{/if}

{#if style === "summary"}
  <ActivitySummaryCard activityAt={activity.watchedAt} {activity} {badges} />
{/if}
