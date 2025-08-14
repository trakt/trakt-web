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
    :global(p.meta-info) {
      color: var(--color-background-red);
    }
  }
</style>
