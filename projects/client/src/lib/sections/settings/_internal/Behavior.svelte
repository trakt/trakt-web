<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { getSwitchInnerText } from "./getSwitchInnerText.ts";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { useSettings } from "./useSettings.ts";

  const { watchAgain, spoilers, isSavingSettings } = useSettings();

  const commonProps = $derived({
    color: "purple" as const,
    disabled: $isSavingSettings,
  });
</script>

<SettingsBlock
  title={m.header_behavior()}
  description={m.description_behavior()}
>
  <SettingsRow title={m.text_show_spoilers()}>
    {#snippet action()}
      <Switch
        innerText={getSwitchInnerText(!$spoilers.isHidden, "yes-no")}
        label={m.switch_label_spoilers()}
        checked={!$spoilers.isHidden}
        onclick={() => $spoilers.set(!$spoilers.isHidden)}
        {...commonProps}
      />
    {/snippet}
  </SettingsRow>

  <SettingsRow title={m.text_show_multiple_watches()}>
    {#snippet action()}
      <Switch
        innerText={getSwitchInnerText($watchAgain.hasWatchAgain, "yes-no")}
        label={m.switch_label_multiple_watches()}
        checked={$watchAgain.hasWatchAgain}
        onclick={() => $watchAgain.set(!$watchAgain.hasWatchAgain)}
        {...commonProps}
      />
    {/snippet}
  </SettingsRow>
</SettingsBlock>
