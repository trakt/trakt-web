<script lang="ts">
  import GearIcon from "$lib/components/icons/GearIcon.svelte";
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import SettingsControlRow from "./SettingsControlRow.svelte";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsSectionLabel from "./SettingsSectionLabel.svelte";
</script>

<SettingsSectionLabel title={m.header_appearance()} />

<SettingsGroupCard>
  <SettingsControlRow title={m.text_theme()}>
    {#snippet icon()}<GearIcon />{/snippet}
    <ThemePicker />
  </SettingsControlRow>

  <SettingsControlRow title={m.text_language()}>
    {#snippet icon()}<GlobeIcon />{/snippet}
    <LocalePicker />
  </SettingsControlRow>
</SettingsGroupCard>
