<script lang="ts">
  import HideIcon from "$lib/components/icons/HideIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsGroupRow from "./SettingsGroupRow.svelte";
  import SettingsSectionLabel from "./SettingsSectionLabel.svelte";
  import { useSettings } from "./useSettings.ts";

  const { watchAgain, spoilers, isSavingSettings } = useSettings();
</script>

<SettingsSectionLabel title={m.header_behavior()} />

<SettingsGroupCard>
  <SettingsGroupRow
    title={m.text_show_spoilers()}
    description={m.description_behavior()}
    variant="custom"
  >
    {#snippet icon()}
      {#if $spoilers.isHidden}
        <HideIcon />
      {:else}
        <ShowIcon />
      {/if}
    {/snippet}
    <Switch
      label={m.switch_label_spoilers()}
      checked={!$spoilers.isHidden}
      onclick={() => $spoilers.set(!$spoilers.isHidden)}
      disabled={$isSavingSettings}
      color="purple"
    />
  </SettingsGroupRow>

  <SettingsGroupRow
    title={m.text_settings_enable_multiple_plays()}
    description={m.text_settings_enable_multiple_plays_description()}
    variant="custom"
  >
    {#snippet icon()}<TrackIcon />{/snippet}
    <Switch
      label={m.switch_label_multiple_watches()}
      checked={$watchAgain.hasWatchAgain}
      onclick={() => $watchAgain.set(!$watchAgain.hasWatchAgain)}
      disabled={$isSavingSettings}
      color="purple"
    />
  </SettingsGroupRow>
</SettingsGroupCard>
