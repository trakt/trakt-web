<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import IdIcon from "$lib/components/icons/IdIcon.svelte";
  import RenameIcon from "$lib/components/icons/RenameIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import ProfileImage from "$lib/sections/profile-banner/ProfileImage.svelte";
  import { getSwitchInnerText } from "./getSwitchInnerText";
  import SettingInputDrawer from "./SettingInputDrawer.svelte";
  import SettingsBlock from "./SettingsBlock.svelte";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsGroupRow from "./SettingsGroupRow.svelte";
  import SettingsRow from "./SettingsRow.svelte";
  import SettingsSectionLabel from "./SettingsSectionLabel.svelte";
  import { useSettings } from "./useSettings";

  const { user } = useUser();
  const { profile, isSavingSettings } = useSettings();

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
        onSave: async (value: string) =>
          (await $profile.set({ name: value }))
            ? undefined
            : { error: m.error_text_failed_update() },
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

<p>{$profile.displayName}</p>
<SettingsRow title={m.text_display_name()}>
  <p class="ellipsis">{$profile.displayName}</p>
</SettingsRow>

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
</SettingsGroupCard>

<SettingsBlock
  title={m.header_account_details()}
  description={m.description_account_details()}
>
  <SettingsRow title={m.text_display_name()}>
    <p class="ellipsis">{$profile.displayName}</p>
    {#snippet action()}
      {@render renameField("name")}
    {/snippet}
  </SettingsRow>

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
