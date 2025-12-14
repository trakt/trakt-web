<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import SettingsButton from "$lib/components/buttons/settings/SettingsButton.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import MoreIcon from "$lib/components/icons/MoreIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { writable } from "$lib/utils/store/WritableSubject.ts";

  const isDrawerOpen = writable(false);
</script>

{#snippet content()}
  <SettingsButton style="dropdown-item" />
  <LogoutButton style="dropdown-item" />
{/snippet}

<RenderFor audience="authenticated" device={["mobile", "tablet-sm"]}>
  <ActionButton
    label={m.button_label_profile_options()}
    onclick={() => isDrawerOpen.set(true)}
    style="ghost"
  >
    <MoreIcon size="normal" />
  </ActionButton>

  {#if $isDrawerOpen}
    <Drawer onClose={() => isDrawerOpen.set(false)} size="auto">
      <div class="trakt-profile-options">
        {@render content()}
      </div>
    </Drawer>
  {/if}
</RenderFor>

<RenderFor audience="authenticated" device={["desktop", "tablet-lg"]}>
  <PopupMenu
    label={m.button_label_profile_options()}
    size="normal"
    mode="standalone"
  >
    {#snippet icon()}
      <MoreIcon size="normal" />
    {/snippet}

    {#snippet items()}
      {@render content()}
    {/snippet}
  </PopupMenu>
</RenderFor>

<style>
  .trakt-profile-options {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
