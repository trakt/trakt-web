<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { getSwitchInnerText } from "./getSwitchInnerText.ts";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { useSettings } from "./useSettings.ts";

  const { preferences, isSavingSettings } = useSettings();
  const innerText = $derived(
    getSwitchInnerText($preferences.hasWatchAgain, "yes-no"),
  );
  //TODO merge with Spoilers; should be one Preferences block
  //TODO better naming
</script>

<SettingsBlock title={"Preferences"} description={"Preferences description"}>
  <SettingsRow title={"Watch again"}>
    {#snippet action()}
      <Switch
        {innerText}
        color="purple"
        label={"Enable watch again"}
        checked={$preferences.hasWatchAgain}
        onclick={() =>
          $preferences.set({ hasWatchAgain: !$preferences.hasWatchAgain })}
        disabled={$isSavingSettings}
      />
    {/snippet}
  </SettingsRow>
</SettingsBlock>
