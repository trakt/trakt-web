<script lang="ts">
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsBlock from "./SettingsBlock.svelte";
</script>

<trakt-danger-zone>
  <SettingsBlock
    title={m.header_danger_zone()}
    description={m.description_danger_zone()}
  >
    <LogoutButton />
  </SettingsBlock>
</trakt-danger-zone>

<style>
  trakt-danger-zone {
    :global(.trakt-settings-block-header p.meta-info) {
      color: var(--color-background-red);

      font-size: var(--ni-14);
      text-transform: uppercase;
    }
  }
</style>
