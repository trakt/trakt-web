<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import EmailIcon from "$lib/components/icons/EmailIcon.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsGroupRow from "./SettingsGroupRow.svelte";
  import SettingsGroupRowSkeleton from "./SettingsGroupRowSkeleton.svelte";
  import SettingsStatusBadge from "./SettingsStatusBadge.svelte";
  import { useEmailSettings } from "./useEmailSettings.ts";

  const { settings, isSaving, set } = useEmailSettings();

  const rows = $derived([
    {
      category: "notifications" as const,
      icon: EmailIcon,
      title: m.text_emails_notifications(),
      description: m.description_emails_notifications(),
      label: m.switch_label_emails_notifications(),
      isEnabled: $settings?.hasNotifications ?? false,
    },
    {
      category: "recaps" as const,
      icon: CalendarIcon,
      title: m.text_emails_recaps(),
      description: m.description_emails_recaps(),
      label: m.switch_label_emails_recaps(),
      isEnabled: $settings?.hasRecaps ?? false,
    },
    {
      category: "marketing" as const,
      icon: SparkleIcon,
      title: m.text_emails_marketing(),
      description: m.description_emails_marketing(),
      label: m.switch_label_emails_marketing(),
      isEnabled: $settings?.hasMarketing ?? false,
    },
  ]);
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
    <SettingsStatusBadge label={m.tag_text_emails_always_on()} />
  </SettingsGroupRow>

  {#if !$settings}
    {#each rows as row (row.category)}
      <SettingsGroupRowSkeleton />
    {/each}
  {:else}
    {#each rows as row (row.category)}
      <SettingsGroupRow
        title={row.title}
        description={row.description}
        variant="custom"
      >
        {#snippet icon()}<row.icon />{/snippet}
        <Switch
          label={row.label}
          checked={row.isEnabled}
          onclick={() => set(row.category, !row.isEnabled)}
          disabled={$isSaving}
        />
      </SettingsGroupRow>
    {/each}
  {/if}
</SettingsGroupCard>
