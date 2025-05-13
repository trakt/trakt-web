<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { getSwitchInnerText } from "./getSwitchInnerText";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { useSettings } from "./useSettings";

  const { spoilers, isSavingSettings } = useSettings();
  const innerText = $derived(getSwitchInnerText($spoilers.isHidden));
</script>

<SettingsBlock title={m.settings_spoilers_title()}>
  <SettingsRow title={m.settings_spoilers_label()}>
    <Switch
      {innerText}
      color="purple"
      label={m.settings_spoilers_label()}
      checked={!$spoilers.isHidden}
      onclick={() => $spoilers.set(!$spoilers.isHidden)}
      disabled={$isSavingSettings}
    />
  </SettingsRow>
</SettingsBlock>
