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

<SettingsBlock title={m.header_spoilers()}>
  <SettingsRow title={m.text_show_spoilers()}>
    <Switch
      {innerText}
      color="purple"
      label={m.switch_label_spoilers()}
      checked={!$spoilers.isHidden}
      onclick={() => $spoilers.set(!$spoilers.isHidden)}
      disabled={$isSavingSettings}
    />
  </SettingsRow>
</SettingsBlock>
