<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
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
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { formatLocalDate } from "$lib/utils/date/formatLocalDate";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SettingInputDrawer from "./SettingInputDrawer.svelte";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsGroupRow from "./SettingsGroupRow.svelte";
  import SettingsSectionLabel from "./SettingsSectionLabel.svelte";
  import { useSettings } from "./useSettings";

  const { user, profile, email, isSavingSettings } = useSettings();

  const promptMap = $derived({
    name: {
      label: m.button_label_change_display_name(),
      drawer: {
        type: "input" as const,
        title: m.input_prompt_display_name(),
        currentValue: $profile.displayName,
        name: m.text_display_name(),
        isRequired: true,
        onSave: async (value: string) =>
          (await $profile.set({ name: value }))
            ? undefined
            : { error: m.error_text_failed_update() },
      },
    },
    username: {
      label: m.button_label_change_username(),
      drawer: {
        type: "input" as const,
        title: m.input_prompt_username(),
        currentValue: $profile.username,
        name: m.text_username(),
        isRequired: true,
        onSave: async (value: string) =>
          (await $profile.set({ username: value }))
            ? undefined
            : { error: m.error_text_username() },
      },
    },
    email: {
      label: m.button_label_change_email(),
      drawer: {
        type: "input" as const,
        title: m.input_prompt_email(),
        currentValue: $email.value ?? "",
        name: m.text_display_email(),
        isRequired: true,
        onSave: async (value: string) =>
          (await $email.set(value))
            ? undefined
            : { error: m.error_text_email() },
      },
    },
    location: {
      label: m.button_label_change_location(),
      drawer: {
        type: "input" as const,
        title: m.input_prompt_location(),
        currentValue: $profile.location,
        name: m.text_location(),
        isRequired: true,
        onSave: async (value: string) =>
          (await $profile.set({ location: value }))
            ? undefined
            : { error: m.error_text_failed_update() },
      },
    },
    about: {
      label: m.button_label_change_about(),
      drawer: {
        type: "textarea" as const,
        title: m.input_prompt_about(),
        currentValue: $profile.about,
        name: m.text_about(),
        isRequired: false,
        onSave: async (value: string) =>
          (await $profile.set({ about: value }))
            ? undefined
            : { error: m.error_text_failed_update() },
      },
    },
    birthday: {
      label: m.button_label_change_birthday(),
      drawer: {
        type: "datepicker" as const,
        title: m.input_prompt_birthday(),
        label: m.button_label_change_birthday(),
        currentValue: $profile.birthday ?? undefined,
        name: m.text_birthday(),
        isRequired: true,
        onSave: async (date: Date) =>
          (await $profile.set({ dob: date ? formatLocalDate(date) : null }))
            ? undefined
            : { error: m.error_text_failed_update() },
      },
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

<div class="trakt-settings-profile-card">
  <ProfileImage
    isEditable
    --image-size="var(--ni-56)"
    --border-width="var(--border-thickness-xs)"
    name={$user.name.first}
    src={$user.avatar.url}
    isVip={$user.isVip}
  />

  <div class="trakt-settings-profile-info">
    <span class="bold ellipsis title">
      {$profile.displayName || $profile.username}
    </span>
    {#if $profile.location}
      <p class="secondary small">{$profile.location}</p>
    {/if}
  </div>

  {#if $user.isVip}
    <VipBadge isDirector={$user.isDirector} />
  {/if}
</div>

<SettingsSectionLabel title={m.header_account_details()} />

<SettingsGroupCard>
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

  {#if Boolean($email.value)}
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
</SettingsGroupCard>

<SettingsSectionLabel title={m.header_settings_privacy()} />

<SettingsGroupCard>
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

{#if activeField}
  <SettingInputDrawer
    {...promptMap[activeField].drawer}
    onClose={() => (activeField = undefined)}
    isSaving={$isSavingSettings}
  />
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-profile-card {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-m);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    max-width: var(--ni-640);
    box-sizing: border-box;

    box-shadow: var(--shadow-base);

    @include for-tablet-sm-and-below() {
      max-width: 100%;
    }
  }

  .trakt-settings-profile-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }
</style>
