<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaSyncAccount } from "$lib/requests/media-sync/models/MediaSyncAccount.ts";

  const {
    account,
    isPicked,
    onPick,
  }: {
    account: MediaSyncAccount;
    isPicked: boolean;
    onPick: () => void;
  } = $props();

  let hasImageFailed = $state(false);

  const name = $derived(account.name ?? m.label_media_sync_unnamed_profile());

  const tag = $derived.by(() => {
    if (account.selected) return m.tag_media_sync_profile_syncing();
    if (account.owner) return m.tag_media_sync_profile_you();
    return "";
  });
</script>

<button
  type="button"
  class="trakt-plex-profile-tile"
  aria-pressed={isPicked}
  aria-label={m.button_label_media_sync_choose_profile({ name })}
  onclick={onPick}
>
  <span class="avatar-ring" class:is-picked={isPicked}>
    <span class="avatar-initial bold">{name.charAt(0)}</span>
    {#if account.avatarUrl && !hasImageFailed}
      <img
        src={account.avatarUrl}
        alt=""
        onerror={() => (hasImageFailed = true)}
      />
    {/if}
  </span>
  <span class="profile-name ellipsis">{name}</span>
  <span class="profile-tag secondary small">{tag}</span>
</button>

<style lang="scss">
  .trakt-plex-profile-tile {
    all: unset;
    cursor: pointer;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);

    width: var(--ni-88);
    padding: var(--gap-xs);
    border-radius: var(--border-radius-m);

    transition: background-color var(--transition-increment) ease-in-out;

    &:hover,
    &:focus-visible {
      background: color-mix(in srgb, var(--purple-500) 10%, transparent);
    }

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--purple-500);
    }
  }

  .avatar-ring {
    position: relative;
    display: flex;

    width: var(--ni-64);
    height: var(--ni-64);
    padding: var(--ni-2);
    border: var(--ni-2) solid transparent;
    border-radius: 50%;

    &.is-picked {
      border-color: var(--purple-500);
    }

    img,
    .avatar-initial {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    img {
      position: absolute;
      top: var(--ni-2);
      left: var(--ni-2);
      width: calc(100% - 2 * var(--ni-2));
      height: calc(100% - 2 * var(--ni-2));

      object-fit: cover;
    }
  }

  .avatar-initial {
    display: flex;
    align-items: center;
    justify-content: center;

    background: color-mix(in srgb, var(--purple-500) 30%, transparent);
    font-size: var(--font-size-title);
  }

  .profile-name {
    max-width: 100%;
  }

  .profile-tag {
    min-height: 1lh;
  }
</style>
