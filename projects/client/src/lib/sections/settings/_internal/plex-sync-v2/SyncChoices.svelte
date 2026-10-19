<script lang="ts">
  import PlexLibraryIcon from "$lib/components/icons/PlexLibraryIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaSyncFeed } from "$lib/requests/media-sync/models/MediaSyncFeed.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsGroupRow from "../SettingsGroupRow.svelte";
  import PlexFeedSwitches from "./PlexFeedSwitches.svelte";

  const {
    feeds,
    available,
    libraries,
    libraryIds,
    onToggleFeed,
    onToggleLibrary,
  }: {
    feeds: MediaSyncFeed[];
    available?: readonly MediaSyncFeed[];
    libraries?: ReadonlyArray<{ externalId: string; title: string }>;
    libraryIds: string[];
    onToggleFeed: (feed: MediaSyncFeed) => void;
    onToggleLibrary: (externalId: string, enabled: boolean) => void;
  } = $props();
</script>

<div class="sync-choices">
  <PlexFeedSwitches {feeds} {available} onToggle={onToggleFeed} />
  {#if libraries}
  <SettingsGroupCard
    variant="bare"
    title={m.header_media_sync_choose_libraries()}
  >
    {#each libraries as library (library.externalId)}
      <SettingsGroupRow title={library.title} variant="custom">
        {#snippet icon()}<PlexLibraryIcon />{/snippet}
        <Switch
          label={library.title}
          checked={libraryIds.includes(library.externalId)}
          onclick={() =>
            onToggleLibrary(
              library.externalId,
              !libraryIds.includes(library.externalId),
            )}
        />
      </SettingsGroupRow>
    {/each}
  </SettingsGroupCard>
  {/if}
</div>

<style lang="scss">
  .sync-choices {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }
</style>
