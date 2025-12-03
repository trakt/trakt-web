<script lang="ts">
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import SettingsButton from "$lib/components/buttons/settings/SettingsButton.svelte";
</script>

<PopupMenu label="TODO" size="normal">
  {#snippet items()}
    <SettingsButton style="dropdown-item" />
    <LogoutButton style="dropdown-item" />
  {/snippet}
</PopupMenu>
