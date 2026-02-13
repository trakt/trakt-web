<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import ListActions from "$lib/sections/lists/user/ListActions.svelte";
  import { getListUrl } from "./getListUrl";

  const {
    list,
    type,
    source,
    onclick,
  }: {
    list: MediaListSummary;
    type?: DiscoverMode;
    source?: string;
    onclick?: () => void;
  } = $props();

  // In list summaries, clicking on the header is considered a drilldown action
  const { track } = useTrack(AnalyticsEvent.Drilldown);
</script>

<div class="trakt-list-header">
  <UserAvatar user={list.user} />

  <div class="list-name-and-creator">
    <Link
      href={getListUrl({ type: "user-list", list, mode: type })}
      onclick={() => {
        onclick?.();
        source && track({ source, type: "list" });
      }}
    >
      <p class="secondary bold ellipsis">
        {list.name}
      </p>
    </Link>
    <div class="list-credits">
      <p class="secondary">{m.text_by()}</p>
      <UserProfileLink user={list.user} />
    </div>
  </div>

  <ListActions {list} />
</div>

<style>
  .trakt-list-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;

    gap: var(--gap-xs);
  }

  .list-name-and-creator {
    display: grid;
    min-width: 0;
    flex-grow: 1;

    :global(.trakt-link) {
      min-width: 0;
    }
  }

  .list-credits {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;

    gap: var(--gap-xxs);
  }
</style>
