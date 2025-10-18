<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import ProfileImageIcon from "$lib/components/icons/ProfileImageIcon.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import ProfileImageUpsellLink from "./_internal/ProfileImageUpsellLink.svelte";
  import { useProfileImage } from "./useProfileImage";

  type SetProfileImageProps = {
    style: "action" | "dropdown-item";
    id: number;
    type: ExtendedMediaType;
  };

  const { style, id, type }: SetProfileImageProps = $props();

  const { isSettingProfileImage, setProfileImage } = $derived(
    useProfileImage({ type, id }),
  );

  const commonProps = $derived({
    onclick: setProfileImage,
    label: "Set as profile image",
  });

  // TODO i18n
</script>

{#snippet actionButton(isDisabled: boolean)}
  <ActionButton style="ghost" disabled={isDisabled} {...commonProps}>
    <ProfileImageIcon />
  </ActionButton>
{/snippet}

<RenderFor audience="free">
  {#if style === "action"}
    <Tooltip content="Only available for VIP members">
      {@render actionButton(true)}
    </Tooltip>
  {/if}

  {#if style === "dropdown-item"}
    <ProfileImageUpsellLink />
  {/if}
</RenderFor>

<RenderFor audience="vip">
  {#if style === "action"}
    {@render actionButton($isSettingProfileImage)}
  {/if}

  {#if style === "dropdown-item"}
    <DropdownItem
      color="default"
      variant="secondary"
      style="flat"
      {...commonProps}
    >
      Set as profile image
      {#snippet icon()}
        <ProfileImageIcon />
      {/snippet}
    </DropdownItem>
  {/if}
</RenderFor>
