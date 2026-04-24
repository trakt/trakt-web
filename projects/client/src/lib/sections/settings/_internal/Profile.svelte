<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { formatLocalDate } from "$lib/utils/date/formatLocalDate";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import ManageSubscriptionButton from "./components/ManageSubscriptionButton.svelte";
  import { getSwitchInnerText } from "./getSwitchInnerText";
  import LargeSettingsRow from "./LargeSettingsRow.svelte";
  import SettingInputDrawer from "./SettingInputDrawer.svelte";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { useSettings } from "./useSettings";

  const aboutLineClamp = 3;

  const { user } = useUser();
  const { profile, email, isSavingSettings } = useSettings();

  const innerText = $derived(getSwitchInnerText($profile.isPrivate, "yes-no"));

  const promptMap = $derived({
    name: {
      label: m.button_label_change_display_name(),
      drawer: {
        type: "input" as const,
        title: m.input_prompt_display_name(),
        currentValue: $profile.displayName,
        name: m.text_display_name(),
        isRequired: true,
        onSave: async (value: string) => $profile.set({ name: value }),
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
        onSave: async (value: string) => $profile.set({ location: value }),
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
        onSave: async (value: string) => $profile.set({ about: value }),
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
          $profile.set({ dob: date ? formatLocalDate(date) : null }),
      },
    },
  });

  type ProfileField = keyof typeof promptMap;
  let activeField = $state<ProfileField>();
</script>

{#snippet renameField(field: ProfileField)}
  <ActionButton
    style="ghost"
    label={promptMap[field].label}
    onclick={() => (activeField = field)}
    disabled={$isSavingSettings}
    size="small"
  >
    <RenameIcon />
  </ActionButton>
{/snippet}

<SettingsBlock
  title={m.header_account_details()}
  description={m.description_account_details()}
>
  <SettingsRow title={m.text_avatar()}>
    <ProfileImage
      isEditable
      --image-size="var(--ni-52)"
      --border-width="var(--border-thickness-xs)"
      name={$user.name.first}
      src={$user.avatar.url}
      isVip={$user.isVip}
    />
  </SettingsRow>

  <SettingsRow title={m.text_display_name()}>
    <p class="ellipsis">{$profile.displayName}</p>
    {#snippet action()}
      {@render renameField("name")}
    {/snippet}
  </SettingsRow>

  {#if Boolean($email.value)}
    <SettingsRow title={m.text_display_email()}>
      <p class="ellipsis">{$email.value}</p>
      {#snippet action()}
        {@render renameField("email")}
      {/snippet}
    </SettingsRow>
  {/if}

  <SettingsRow title={m.text_birthday()}>
    <p class="ellipsis">
      {$profile.birthday
        ? toHumanDay({ date: $profile.birthday, locale: getLocale() })
        : ""}
    </p>
    {#snippet action()}
      {@render renameField("birthday")}
    {/snippet}
  </SettingsRow>

  <SettingsRow title={m.text_location()}>
    <p class="ellipsis">{$profile.location}</p>
    {#snippet action()}
      {@render renameField("location")}
    {/snippet}
  </SettingsRow>

  <LargeSettingsRow title={m.text_about()}>
    {#snippet action()}
      {@render renameField("about")}
    {/snippet}
    <p
      class="trakt-about-text"
      style="--line-clamp-lines: {aboutLineClamp}"
      use:lineClamp={{ lines: aboutLineClamp }}
    >
      {$profile.about}
    </p>
  </LargeSettingsRow>

  <ManageSubscriptionButton />

  <SettingsRow title={m.text_private_account()}>
    {#snippet action()}
      <Switch
        {innerText}
        color="purple"
        label={m.switch_label_private()}
        checked={$profile.isPrivate}
        onclick={() => $profile.set({ private: !$profile.isPrivate })}
        disabled={$isSavingSettings}
      />
    {/snippet}
  </SettingsRow>
</SettingsBlock>

{#if activeField}
  <SettingInputDrawer
    {...promptMap[activeField].drawer}
    onClose={() => (activeField = undefined)}
    isSaving={$isSavingSettings}
  />
{/if}

<style>
  /* FIXME: find out why the initial values set in lineClamp are not applied */
  .trakt-about-text {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: var(--line-clamp-lines);

    display: -webkit-box;
    overflow: hidden;
    line-clamp: var(--line-clamp-lines);
  }
</style>
