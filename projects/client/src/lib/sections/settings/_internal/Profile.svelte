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
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import { useSettings } from "./useSettings";

  const ABOUT_LINE_CLAMP = 3;

  const { user } = useUser();
  const { profile, isSavingSettings } = useSettings();

  const innerText = $derived(getSwitchInnerText($profile.isPrivate, "yes-no"));

  const promptMap = $derived({
    name: {
      prompt: m.input_prompt_display_name(),
      label: m.button_label_change_display_name(),
      currentValue: $profile.displayName,
    },
    location: {
      prompt: m.input_prompt_location(),
      label: m.button_label_change_location(),
      currentValue: $profile.location,
    },
    about: {
      prompt: m.input_prompt_about(),
      label: m.button_label_change_about(),
      currentValue: $profile.about,
    },
  });

  // FIXME: change to input/text area elements
  const handleFieldChange = (field: keyof typeof promptMap) => {
    // skipcq: JS-0052
    const enteredValue = prompt(
      promptMap[field].prompt,
      promptMap[field].currentValue,
    );

    if (!enteredValue || enteredValue.trim() === "") {
      return;
    }

    $profile.set({ [field]: enteredValue.trim() });
  };
</script>

{#snippet renameField(field: keyof typeof promptMap)}
  <ActionButton
    style="flat"
    label={promptMap[field].label}
    onclick={() => handleFieldChange(field)}
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
      --width="var(--ni-52)"
      --height="var(--ni-52)"
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
