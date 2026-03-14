<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import ManageSubscriptionButton from "./components/ManageSubscriptionButton.svelte";
  import { getSwitchInnerText } from "./getSwitchInnerText";
  import LargeSettingsRow from "./LargeSettingsRow.svelte";
  import SettingInputDrawer from "./SettingInputDrawer.svelte";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { useSettings } from "./useSettings";

  const ABOUT_LINE_CLAMP = 3;

  const { user } = useUser();
  const { profile, email, isSavingSettings } = useSettings();

  const innerText = $derived(getSwitchInnerText($profile.isPrivate, "yes-no"));

  const promptMap = $derived({
    name: {
      prompt: m.input_prompt_display_name(),
      label: m.button_label_change_display_name(),
      currentValue: $profile.displayName,
      name: m.text_display_name(),
    },
    email: {
      prompt: m.input_prompt_email(),
      label: m.button_label_change_email(),
      currentValue: $email.value ?? "",
      name: m.text_display_email(),
    },
    location: {
      prompt: m.input_prompt_location(),
      label: m.button_label_change_location(),
      currentValue: $profile.location,
      name: m.text_location(),
    },
    about: {
      prompt: m.input_prompt_about(),
      label: m.button_label_change_about(),
      currentValue: $profile.about,
      name: m.text_about(),
    },
  });

  type ProfileField = keyof typeof promptMap;
  let activeField = $state<ProfileField>();

  const handleSaveField = async (value: string) => {
    if (!activeField) return;

    if (activeField === "email") {
      return (await $email.set(value))
        ? undefined
        : { error: m.error_text_email() };
    }

    return $profile.set({ [activeField]: value });
  };
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
      style="--line-clamp-lines: {ABOUT_LINE_CLAMP}"
      use:lineClamp={{ lines: ABOUT_LINE_CLAMP }}
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
    isRequired={activeField !== "about"}
    type={activeField === "about" ? "textarea" : "input"}
    title={promptMap[activeField].prompt}
    name={promptMap[activeField].name}
    currentValue={promptMap[activeField].currentValue}
    onClose={() => (activeField = undefined)}
    onSave={handleSaveField}
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
