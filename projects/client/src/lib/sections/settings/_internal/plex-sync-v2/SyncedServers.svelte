<script lang="ts">
  import type { MediaSyncConnection } from "$lib/requests/media-sync/models/MediaSyncConnection.ts";
  import SettingsGroupCard from "../SettingsGroupCard.svelte";
  import SettingsSection from "../SettingsSection.svelte";
  import PlexSyncRuns from "./PlexSyncRuns.svelte";
  import PlexSyncServerRow from "./PlexSyncServerRow.svelte";

  const {
    title,
    description,
    connections,
    onReconnect,
  }: {
    title: string;
    description: string;
    connections: MediaSyncConnection[];
    onReconnect: () => void;
  } = $props();
</script>

<SettingsSection {title} {description}>
  <SettingsGroupCard>
    {#each connections as connection (connection.id)}
      <PlexSyncServerRow {connection} {onReconnect} />
    {/each}
  </SettingsGroupCard>
</SettingsSection>

{#each connections as connection (connection.id)}
  <PlexSyncRuns {connection} />
{/each}
