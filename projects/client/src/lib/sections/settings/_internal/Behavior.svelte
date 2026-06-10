<script lang="ts">
  import HideIcon from "$lib/components/icons/HideIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsSectionLabel from "./SettingsSectionLabel.svelte";
  import SettingsToggleRow from "./SettingsToggleRow.svelte";
  import { useSettings } from "./useSettings.ts";

  const { watchAgain, spoilers, isSavingSettings } = useSettings();
</script>

<SettingsSectionLabel title={m.header_behavior()} />

<SettingsGroupCard>
  <SettingsToggleRow
    title={m.text_show_spoilers()}
    description={m.description_behavior()}
    label={m.switch_label_spoilers()}
    checked={!$spoilers.isHidden}
    onclick={() => $spoilers.set(!$spoilers.isHidden)}
    disabled={$isSavingSettings}
  >
    {#snippet icon()}
      {#if $spoilers.isHidden}
        <HideIcon />
      {:else}
        <ShowIcon />
      {/if}
    {/snippet}
  </SettingsToggleRow>

  <SettingsToggleRow
    title={m.text_settings_enable_multiple_plays()}
    description={m.text_settings_enable_multiple_plays_description()}
    label={m.switch_label_multiple_watches()}
    checked={$watchAgain.hasWatchAgain}
    onclick={() => $watchAgain.set(!$watchAgain.hasWatchAgain)}
    disabled={$isSavingSettings}
  >
    {#snippet icon()}
      <TrackIcon />
    {/snippet}
  </SettingsToggleRow>
</SettingsGroupCard>
