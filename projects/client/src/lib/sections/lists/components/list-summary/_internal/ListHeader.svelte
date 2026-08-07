<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import ListMeta from "$lib/sections/lists/components/ListMeta.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import ListPopupMenu from "$lib/sections/lists/user/ListPopupMenu.svelte";
  import { getListUrl } from "./getListUrl.ts";

  const {
    list,
    source,
    onclick,
  }: {
    list: MediaListSummary;
    source?: string;
    onclick?: () => void;
  } = $props();

  // In list summaries, clicking on the header is considered a drilldown action
  const { track } = useTrack(AnalyticsEvent.Drilldown);

  const handleDrilldown = () => {
    onclick?.();

    if (source) {
      track({ source, type: "list" });
    }
  };
</script>

<div class="trakt-list-header">
  <UserAvatar user={list.user} />

  <div class="list-content">
    <Link href={getListUrl({ type: "user-list", list })} onclick={handleDrilldown}>
      <p class="secondary bold ellipsis">
        {list.name}
      </p>
    </Link>

    <ListMeta
      {list}
      countUrl={getListUrl({ type: "user-list", list })}
      onCountClick={handleDrilldown}
    />
  </div>

  <ListPopupMenu {list} />
</div>

<style lang="scss">
  .trakt-list-header {
    display: flex;
    align-items: center;

    width: 100%;
    min-width: 0;

    gap: var(--gap-xs);

    > :global(.trakt-link),
    > :global(.trakt-user-avatar) {
      display: flex;
      flex-shrink: 0;

      margin-inline-end: var(--ni-2);
    }
  }

  .list-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-width: 0;

    gap: var(--gap-xxs);

    > :global(.trakt-link) {
      min-width: 0;
      max-width: 100%;
      align-self: flex-start;
    }
  }
</style>
