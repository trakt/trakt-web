<script lang="ts">
  import CalendarIcon from "$lib/components/icons/CalendarIcon.svelte";
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import NotesIcon from "$lib/components/icons/NotesIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import StarIcon from "$lib/components/icons/StarIcon.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { formatLocalDate } from "$lib/utils/date/formatLocalDate";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SettingInputDrawer from "./SettingInputDrawer.svelte";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsNavRow from "./SettingsNavRow.svelte";
  import SettingsSectionLabel from "./SettingsSectionLabel.svelte";
  import SettingsToggleRow from "./SettingsToggleRow.svelte";
  import { useSettings } from "./useSettings";

  const { user } = useUser();
  const { profile, email, isSavingSettings } = useSettings();

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

<div class="profile-hero-card">
  <div class="hero-avatar">
    <ProfileImage
      isEditable
      --image-size="var(--ni-56)"
      --border-width="var(--border-thickness-xs)"
      name={$user.name.first}
      src={$user.avatar.url}
      isVip={$user.isVip}
    />
  </div>

  <div class="hero-info">
    <p class="hero-name bold ellipsis">{$profile.displayName || $profile.username}</p>
    {#if $profile.location}
      <p class="hero-location">{$profile.location}</p>
    {/if}
  </div>

  {#if $user.isVip}
    <span class="vip-badge">VIP</span>
  {/if}
</div>

<SettingsSectionLabel title={m.header_account_details()} />

<SettingsGroupCard>
  <SettingsNavRow
    title={m.text_display_name()}
    value={$profile.displayName}
    onclick={() => (activeField = "name")}
    disabled={$isSavingSettings}
  >
    {#snippet icon()}<ProfileIcon />{/snippet}
  </SettingsNavRow>

  <SettingsNavRow
    title={m.text_username()}
    value={$profile.username ? `@${$profile.username}` : ""}
    onclick={() => (activeField = "username")}
    disabled={$isSavingSettings}
  >
    {#snippet icon()}<ProfileIcon />{/snippet}
  </SettingsNavRow>

  {#if Boolean($email.value)}
    <SettingsNavRow
      title={m.text_display_email()}
      value={$email.value ?? ""}
      onclick={() => (activeField = "email")}
      disabled={$isSavingSettings}
    >
      {#snippet icon()}<ProfileIcon />{/snippet}
    </SettingsNavRow>
  {/if}

  <SettingsNavRow
    title={m.text_birthday()}
    value={birthdayLabel}
    onclick={() => (activeField = "birthday")}
    disabled={$isSavingSettings}
  >
    {#snippet icon()}<CalendarIcon />{/snippet}
  </SettingsNavRow>

  <SettingsNavRow
    title={m.text_location()}
    value={$profile.location}
    onclick={() => (activeField = "location")}
    disabled={$isSavingSettings}
  >
    {#snippet icon()}<GlobeIcon />{/snippet}
  </SettingsNavRow>

  <SettingsNavRow
    title={m.text_about()}
    description={$profile.about}
    onclick={() => (activeField = "about")}
    disabled={$isSavingSettings}
  >
    {#snippet icon()}<NotesIcon />{/snippet}
  </SettingsNavRow>
</SettingsGroupCard>

<SettingsSectionLabel title={m.header_settings_privacy()} />

<SettingsGroupCard>
  <SettingsToggleRow
    title={m.text_private_account()}
    label={m.switch_label_private()}
    checked={$profile.isPrivate}
    onclick={() => $profile.set({ private: !$profile.isPrivate })}
    disabled={$isSavingSettings}
  >
    {#snippet icon()}<LockIcon />{/snippet}
  </SettingsToggleRow>

  <SettingsNavRow
    title={m.button_text_manage_subscription()}
    href={UrlBuilder.vip()}
  >
    {#snippet icon()}<StarIcon fill="none" />{/snippet}
  </SettingsNavRow>
</SettingsGroupCard>

{#if activeField}
  <SettingInputDrawer
    {...promptMap[activeField].drawer}
    onClose={() => (activeField = undefined)}
    isSaving={$isSavingSettings}
  />
{/if}

<style lang="scss">
  .profile-hero-card {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    padding: var(--gap-m);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    max-width: 600px;
    box-sizing: border-box;
  }

  .hero-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }

  .hero-name {
    font-size: var(--font-size-separator);
    color: var(--color-text-primary);
  }

  .hero-location {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
  }

  .vip-badge {
    flex-shrink: 0;
    font-size: var(--ni-18);
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--color-foreground-vip-badge);
    background: var(--color-background-vip-badge);
    padding: var(--gap-xs) var(--gap-s);
    border-radius: 9999px;
  }
</style>
