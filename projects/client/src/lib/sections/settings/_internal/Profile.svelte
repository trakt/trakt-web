<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { getSwitchInnerText } from "./getSwitchInnerText";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { useSettings } from "./useSettings";

  const { user } = useUser();
  const { privacy, isSavingSettings } = useSettings();

  const innerText = $derived(getSwitchInnerText($privacy.isPrivate, "yes-no"));
</script>

<SettingsBlock title={m.header_profile()}>
  <SettingsRow title={m.text_avatar()}>
    <ProfileImage
      isEditable
      --width="var(--ni-32)"
      --height="var(--ni-32)"
      --border-width="var(--border-thickness-xs)"
      name={$user.name.first}
      src={$user.avatar.url}
    />
  </SettingsRow>
  <SettingsRow title={m.text_private()}>
    <Switch
      {innerText}
      color="purple"
      label={m.switch_label_private()}
      checked={$privacy.isPrivate}
      onclick={() => $privacy.set(!$privacy.isPrivate)}
      disabled={$isSavingSettings}
    />
  </SettingsRow>
</SettingsBlock>
