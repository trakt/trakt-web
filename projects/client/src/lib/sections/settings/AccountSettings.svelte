<script lang="ts">
  import AboutIcon from "$lib/components/icons/AboutIcon.svelte";
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import EmailIcon from "$lib/components/icons/EmailIcon.svelte";
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import IdIcon from "$lib/components/icons/IdIcon.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { formatLocalDate } from "$lib/utils/date/formatLocalDate.ts";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SettingInputDrawer from "./_internal/SettingInputDrawer.svelte";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsGroupRow from "./_internal/SettingsGroupRow.svelte";
  import { useSettings } from "./_internal/useSettings.ts";

  const { profile, email, isSavingSettings } = useSettings();

  const toSaveResult = (didSave: boolean, error: string) =>
    didSave ? undefined : { error };

  const promptMap = $derived({
    name: {
      type: "input" as const,
      title: m.input_prompt_display_name(),
      currentValue: $profile.displayName,
      name: m.text_display_name(),
      isRequired: true,
      onSave: async (value: string) =>
        toSaveResult(
          await $profile.set({ name: value }),
          m.error_text_failed_update(),
        ),
    },
    username: {
      type: "input" as const,
      title: m.input_prompt_username(),
      currentValue: $profile.username,
      name: m.text_username(),
      isRequired: true,
      onSave: async (value: string) =>
        toSaveResult(
          await $profile.set({ username: value }),
          m.error_text_username(),
        ),
    },
    email: {
      type: "input" as const,
      title: m.input_prompt_email(),
      currentValue: $email.value ?? "",
      name: m.text_display_email(),
      isRequired: true,
      onSave: async (value: string) =>
        toSaveResult(await $email.set(value), m.error_text_email()),
    },
    location: {
      type: "input" as const,
      title: m.input_prompt_location(),
      currentValue: $profile.location,
      name: m.text_location(),
      isRequired: true,
      onSave: async (value: string) =>
        toSaveResult(
          await $profile.set({ location: value }),
          m.error_text_failed_update(),
        ),
    },
    about: {
      type: "textarea" as const,
      title: m.input_prompt_about(),
      currentValue: $profile.about,
      name: m.text_about(),
      isRequired: false,
      onSave: async (value: string) =>
        toSaveResult(
          await $profile.set({ about: value }),
          m.error_text_failed_update(),
        ),
    },
    birthday: {
      type: "datepicker" as const,
      title: m.input_prompt_birthday(),
      label: m.button_label_change_birthday(),
      currentValue: $profile.birthday ?? undefined,
      name: m.text_birthday(),
      isRequired: true,
      onSave: async (date: Date) =>
        toSaveResult(
          await $profile.set({ dob: date ? formatLocalDate(date) : null }),
          m.error_text_failed_update(),
        ),
    },
  });

  type ProfileField = keyof typeof promptMap;
  let activeField = $state<ProfileField>();

  const birthdayLabel = $derived(
    $profile.birthday
      ? toHumanDay({ date: $profile.birthday, locale: getLocale() })
      : "",
  );
</script>

<div class="trakt-account-settings">
  <SettingsGroupCard title={m.header_account_details()}>
    <SettingsGroupRow
      title={m.text_display_name()}
      label={m.button_label_change_display_name()}
      value={$profile.displayName}
      onclick={() => (activeField = "name")}
      disabled={$isSavingSettings}
      variant="button"
    >
      {#snippet icon()}<IdIcon />{/snippet}
    </SettingsGroupRow>

    <SettingsGroupRow
      title={m.text_username()}
      label={m.button_label_change_username()}
      value={$profile.username ? `@${$profile.username}` : ""}
      onclick={() => (activeField = "username")}
      disabled={$isSavingSettings}
      variant="button"
    >
      {#snippet icon()}<ProfileIcon />{/snippet}
    </SettingsGroupRow>

    {#if $email.value}
      <SettingsGroupRow
        title={m.text_display_email()}
        label={m.button_label_change_email()}
        value={$email.value ?? ""}
        onclick={() => (activeField = "email")}
        disabled={$isSavingSettings}
        variant="button"
      >
        {#snippet icon()}<EmailIcon />{/snippet}
      </SettingsGroupRow>
    {/if}

    <SettingsGroupRow
      title={m.text_birthday()}
      label={m.button_label_change_birthday()}
      value={birthdayLabel}
      onclick={() => (activeField = "birthday")}
      disabled={$isSavingSettings}
      variant="button"
    >
      {#snippet icon()}<CalendarIcon />{/snippet}
    </SettingsGroupRow>

    <SettingsGroupRow
      title={m.text_location()}
      label={m.button_label_change_location()}
      value={$profile.location}
      onclick={() => (activeField = "location")}
      disabled={$isSavingSettings}
      variant="button"
    >
      {#snippet icon()}<GlobeIcon />{/snippet}
    </SettingsGroupRow>

    <SettingsGroupRow
      title={m.text_about()}
      label={m.button_label_change_about()}
      description={$profile.about}
      onclick={() => (activeField = "about")}
      disabled={$isSavingSettings}
      variant="button"
    >
      {#snippet icon()}<AboutIcon />{/snippet}
    </SettingsGroupRow>

    <SettingsGroupRow title={m.text_private_account()} variant="custom">
      {#snippet icon()}<LockIcon />{/snippet}
      <Switch
        label={m.switch_label_private()}
        checked={$profile.isPrivate}
        onclick={() => $profile.set({ private: !$profile.isPrivate })}
        disabled={$isSavingSettings}
        color="purple"
      />
    </SettingsGroupRow>

    <SettingsGroupRow
      title={m.button_text_manage_subscription()}
      href={UrlBuilder.vip()}
      variant="link"
    >
      {#snippet icon()}<StarIcon fill="none" />{/snippet}
    </SettingsGroupRow>
  </SettingsGroupCard>
</div>

{#if activeField}
  <SettingInputDrawer
    {...promptMap[activeField]}
    onClose={() => (activeField = undefined)}
    isSaving={$isSavingSettings}
  />
{/if}

<style lang="scss">
  .trakt-account-settings {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
