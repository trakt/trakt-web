<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaSyncAccount } from "$lib/requests/media-sync/models/MediaSyncAccount.ts";
  import PlexProfileTile from "./PlexProfileTile.svelte";

  const {
    accounts,
    pickedAccountId,
    onPick,
  }: {
    accounts: MediaSyncAccount[];
    pickedAccountId: string | null;
    onPick: (accountId: string) => void;
  } = $props();

  const picked = $derived(
    accounts.find((account) => account.accountId === pickedAccountId),
  );
</script>

<div class="trakt-plex-profile-picker">
  <div class="picker-header">
    <p class="bold">{m.header_media_sync_profiles()}</p>
    <p class="secondary">{m.description_media_sync_profiles()}</p>
  </div>

  <div class="profile-tiles">
    {#each accounts as account (account.accountId)}
      <PlexProfileTile
        {account}
        isPicked={account.accountId === pickedAccountId}
        onPick={() => onPick(account.accountId)}
      />
    {/each}
  </div>

  {#if picked && !picked.selected}
    <p class="profile-switch">
      {m.text_media_sync_profile_switch({
        name: picked.name ?? m.label_media_sync_unnamed_profile(),
      })}
    </p>
  {/if}

  <p class="secondary small">{m.text_media_sync_profile_note()}</p>
</div>

<style lang="scss">
  .trakt-plex-profile-picker {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    p {
      margin: 0;
    }
  }

  .picker-header {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .profile-tiles {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-xs);
  }

  .profile-switch {
    padding: var(--gap-s) var(--gap-m);
    border: var(--border-thickness-xs) solid var(--orange-500);
    border-radius: var(--border-radius-m);
  }
</style>
