<script lang="ts">
  import EmailIcon from "$lib/components/icons/EmailIcon.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsGroupRow from "./SettingsGroupRow.svelte";
  import SettingsStatusBadge from "./SettingsStatusBadge.svelte";
  import { useEmailSettings } from "./useEmailSettings.ts";

  const { settings, isSaving, setNotifications, setMarketing } =
    useEmailSettings();

  const isDisabled = $derived(!$settings || $isSaving);
</script>

<SettingsGroupCard
  title={m.header_emails()}
  description={m.description_emails()}
>
  <SettingsGroupRow
    title={m.text_emails_system()}
    description={m.description_emails_system()}
    variant="custom"
  >
    {#snippet icon()}<LockIcon />{/snippet}
    <SettingsStatusBadge label={m.tag_emails_always_on()} />
  </SettingsGroupRow>

  <SettingsGroupRow
    title={m.text_emails_notifications()}
    description={m.description_emails_notifications()}
    variant="custom"
  >
    {#snippet icon()}<EmailIcon />{/snippet}
    <Switch
      label={m.switch_label_emails_notifications()}
      checked={$settings?.hasNotifications ?? false}
      onclick={() => setNotifications(!$settings?.hasNotifications)}
      disabled={isDisabled}
    />
  </SettingsGroupRow>

  <SettingsGroupRow
    title={m.text_emails_marketing()}
    description={m.description_emails_marketing()}
    variant="custom"
  >
    {#snippet icon()}<SparkleIcon />{/snippet}
    <Switch
      label={m.switch_label_emails_marketing()}
      checked={$settings?.hasMarketing ?? false}
      onclick={() => setMarketing(!$settings?.hasMarketing)}
      disabled={isDisabled}
    />
  </SettingsGroupRow>
</SettingsGroupCard>
