<script lang="ts">
  import BookmarkIcon from "$lib/components/icons/BookmarkIcon.svelte";
  import ClockIcon from "$lib/components/icons/ClockIcon.svelte";
  import LibraryIcon from "$lib/components/icons/LibraryIcon.svelte";
  import RatingsIcon from "$lib/components/icons/RatingsIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import {
    type MediaSyncFeed,
    MediaSyncFeedSchema,
  } from "$lib/requests/media-sync/models/MediaSyncFeed.ts";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";

  const {
    feeds,
    onToggle,
  }: {
    feeds: MediaSyncFeed[];
    onToggle: (feed: MediaSyncFeed) => void;
  } = $props();

  const FEED_COPY: Record<
    MediaSyncFeed,
    { title: () => string; description: () => string }
  > = {
    history: {
      title: m.label_media_sync_feed_history,
      description: m.description_media_sync_feed_history,
    },
    ratings: {
      title: m.label_media_sync_feed_ratings,
      description: m.description_media_sync_feed_ratings,
    },
    collection: {
      title: m.label_media_sync_feed_collection,
      description: m.description_media_sync_feed_collection,
    },
    watchlist: {
      title: m.label_media_sync_feed_watchlist,
      description: m.description_media_sync_feed_watchlist,
    },
  };
</script>

<SettingsGroupCard
  variant="bare"
  title={m.header_media_sync_feeds()}
  description={m.description_media_sync_feeds()}
>
  {#each MediaSyncFeedSchema.options as feed (feed)}
    <SettingsGroupRow
      title={FEED_COPY[feed].title()}
      description={FEED_COPY[feed].description()}
      variant="custom"
    >
      {#snippet icon()}
        {#if feed === "history"}
          <ClockIcon />
        {:else if feed === "ratings"}
          <RatingsIcon />
        {:else if feed === "collection"}
          <LibraryIcon />
        {:else}
          <BookmarkIcon state="added" />
        {/if}
      {/snippet}
      <Switch
        label={FEED_COPY[feed].title()}
        checked={feeds.includes(feed)}
        onclick={() => onToggle(feed)}
      />
    </SettingsGroupRow>
  {/each}
</SettingsGroupCard>
