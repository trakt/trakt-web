<script lang="ts">
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import ThemeIcon from "$lib/components/icons/ThemeIcon.svelte";
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsGroupRow from "./SettingsGroupRow.svelte";
</script>

<SettingsGroupCard title={m.header_appearance()}>
  <SettingsGroupRow title={m.text_theme()} variant="custom">
    {#snippet icon()}<ThemeIcon />{/snippet}
    <ThemePicker />
  </SettingsGroupRow>

  <SettingsGroupRow title={m.text_language()} variant="custom">
    {#snippet icon()}<GlobeIcon />{/snippet}
    <LocalePicker />
  </SettingsGroupRow>
</SettingsGroupCard>
