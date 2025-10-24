<script lang="ts">
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";
</script>

<SettingsBlock
  title={m.header_appearance()}
  description={m.description_appearance()}
>
  <SettingsRow title={m.text_theme()}>
    <ThemePicker />
  </SettingsRow>

  <SettingsRow title={m.text_language()}>
    <LocalePicker />
  </SettingsRow>
</SettingsBlock>
