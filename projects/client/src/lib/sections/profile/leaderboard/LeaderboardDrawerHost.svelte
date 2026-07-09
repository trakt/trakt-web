<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import PaginatedList from "$lib/components/lists/PaginatedList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DEFAULT_DRILL_SIZE } from "$lib/utils/constants.ts";
  import { useLeaderboard } from "../stores/useLeaderboard.ts";
  import { useLeaderboardViewer } from "../stores/useLeaderboardViewer.ts";
  import LeaderboardItem from "./_internal/LeaderboardItem.svelte";
  import LeaderboardViewerCard from "./_internal/LeaderboardViewerCard.svelte";

  type LeaderboardDrawerHostProps = {
    slug: string;
    onClose: () => void;
  };

  const { slug, onClose }: LeaderboardDrawerHostProps = $props();

  const { viewer } = useLeaderboardViewer();

  let isOpened = $state(false);
</script>

<Drawer {onClose} title={m.header_leaderboard()} size="large" onOpened={() => (isOpened = true)}>
  {#if isOpened}
    <div class="trakt-leaderboard-list">
      <PaginatedList
        type="leaderboard"
        target="parent"
        useList={() => useLeaderboard({ slug, limit: DEFAULT_DRILL_SIZE })}
      >
        {#snippet items(entries)}
          {@const firstFreeIndex = entries.findIndex(
            (entry) => entry.locked && !entry.isViewer,
          )}
          {#each entries as entry, index (entry.key)}
            {#if index === firstFreeIndex}
              <div class="trakt-leaderboard-divider">
                <span class="tag secondary bold">
                  {m.text_leaderboard_free_section()}
                </span>
              </div>
            {/if}
            <LeaderboardItem {entry} />
          {/each}
        {/snippet}
      </PaginatedList>

      {#if $viewer}
        <div class="trakt-leaderboard-viewer-footer">
          <LeaderboardViewerCard user={$viewer.user} plays={$viewer.plays} />
        </div>
      {/if}
    </div>
  {/if}
</Drawer>

<style lang="scss">
  .trakt-leaderboard-list {
    position: relative;
    overflow-y: auto;
    overscroll-behavior: contain;

    :global(.trakt-paginated-list) {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }
  }

  .trakt-leaderboard-viewer-footer {
    position: sticky;
    bottom: 0;
    z-index: var(--layer-raised);

    margin-top: var(--gap-s);
    padding-top: var(--gap-s);

    /* Occlude the list scrolling underneath the pinned card. */
    background: var(--color-drawer-background);
  }

  .trakt-leaderboard-divider {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    margin-top: var(--gap-s);

    color: var(--color-text-secondary);

    &::before,
    &::after {
      content: "";
      flex: 1;
      height: var(--ni-1);
      background: color-mix(in srgb, var(--color-border) 50%, transparent);
    }
  }
</style>
