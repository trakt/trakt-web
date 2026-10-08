<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import BlockIcon from "$lib/components/icons/BlockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { UserProfile } from "$lib/requests/models/UserProfile.ts";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import { toDisplayableName } from "$lib/utils/profile/toDisplayableName.ts";

  type SharedByAvatarProps = {
    user: UserProfile;
    isMuting: boolean;
    onMute: (sharerId: number) => void;
  };

  const { user, isMuting, onMute }: SharedByAvatarProps = $props();

  const name = $derived(toDisplayableName(user));
</script>

<span class="trakt-shared-by-avatar">
  <PopupMenu label={name} title={name} mode="standalone" size="normal">
    {#snippet icon()}
      <span class="shared-by-avatar-icon">
        <UserAvatar {user} size="small" linked={false} />
      </span>
    {/snippet}

    {#snippet items()}
      <li class="trakt-shared-by-header">
        <UserAvatar {user} size="small" linked={false} />
        <p class="bold ellipsis">{name}</p>
      </li>
      <DropdownItem
        style="flat"
        color="default"
        variant="secondary"
        disabled={isMuting}
        onclick={() => onMute(user.id)}
      >
        {m.button_label_hide_their_recommendations()}
        {#snippet icon()}
          <BlockIcon />
        {/snippet}
      </DropdownItem>
    {/snippet}
  </PopupMenu>
</span>

<style lang="scss">
  .trakt-shared-by-avatar {
    display: inline-flex;

    :global(.trakt-popup-menu-button.has-custom-icon:hover),
    :global(.trakt-popup-menu-button.has-custom-icon[data-popup-state="opened"]) {
      background-color: transparent;
    }
  }

  .shared-by-avatar-icon {
    display: inline-flex;
    width: var(--ni-32);
    height: var(--ni-32);

    :global(.trakt-user-avatar) {
      width: 100%;
      height: 100%;
    }
  }

  .trakt-shared-by-header {
    list-style: none;
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    padding: var(--ni-4) var(--ni-12);

    :global(.trakt-popup-menu-container) & {
      color: var(--shade-900);
    }

    :global(.trakt-user-avatar) {
      width: var(--ni-24);
      height: var(--ni-24);
    }
  }
</style>
