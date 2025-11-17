<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CoverImageIcon from "$lib/components/icons/CoverImageIcon.svelte";
  import Tooltip from "$lib/components/tooltip/Tooltip.svelte";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import CoverImageUpsellLink from "./_internal/CoverImageUpsellLink.svelte";
  import { useCoverImage } from "./useCoverImage";

  type SetCoverImageActionProps = {
    style: "action" | "dropdown-item";
    id: number;
    type: ExtendedMediaType;
    title: string;
    variant?: "primary" | "secondary";
  };

  const {
    style,
    id,
    type,
    title,
    variant = "secondary",
  }: SetCoverImageActionProps = $props();

  const { isSettingCoverImage, setCoverImage } = $derived(
    useCoverImage({ type, id }),
  );

  const commonProps = $derived({
    onclick: setCoverImage,
    label: m.button_label_set_cover_image({ title }),
  });
</script>

{#snippet actionButton(isDisabled: boolean)}
  <ActionButton style="ghost" disabled={isDisabled} {...commonProps}>
    <CoverImageIcon />
  </ActionButton>
{/snippet}

<RenderFor audience="free">
  {#if style === "action"}
    <Tooltip content="Only available for VIP members">
      {@render actionButton(true)}
    </Tooltip>
  {/if}

  {#if style === "dropdown-item"}
    <CoverImageUpsellLink />
  {/if}
</RenderFor>

<RenderFor audience="vip">
  {#if style === "action"}
    {@render actionButton($isSettingCoverImage)}
  {/if}

  {#if style === "dropdown-item"}
    <DropdownItem color="default" style="flat" {variant} {...commonProps}>
      {m.button_text_set_cover_image()}
      {#snippet icon()}
        <CoverImageIcon />
      {/snippet}
    </DropdownItem>
  {/if}
</RenderFor>
