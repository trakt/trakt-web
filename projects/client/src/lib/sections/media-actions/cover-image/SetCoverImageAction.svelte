<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CoverImageIcon from "$lib/components/icons/CoverImageIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import { useCoverImage } from "./useCoverImage";
  import { useIsCover } from "./useIsCover";
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";

  type SetCoverImageActionProps = {
    style: "action" | "dropdown-item";
    id: number;
    type: ExtendedMediaType;
    title: string;
    coverUrl?: HttpsUrl | Nil;
    variant?: "primary" | "secondary";
  };

  const {
    style,
    id,
    type,
    title,
    coverUrl,
    variant = "secondary",
  }: SetCoverImageActionProps = $props();

  const { isSettingCoverImage, setCoverImage } = $derived(
    useCoverImage({ type, id, title, coverUrl }),
  );
  const { isCover } = $derived(useIsCover({ type, id }));

  const label = $derived(
    $isCover
      ? m.button_label_cover_image_selected({ title })
      : m.button_label_set_cover_image({ title }),
  );

  const commonProps = $derived({
    onclick: setCoverImage,
    label,
    disabled: $isSettingCoverImage || $isCover,
  });
</script>

{#snippet icon()}
  {#if $isSettingCoverImage}
    <LoadingIndicator />
  {:else}
    <CoverImageIcon />
  {/if}
{/snippet}

{#snippet coverSubtitle()}
  {m.button_subtitle_cover_image_selected()}
{/snippet}

{#if style === "action"}
  <ActionButton style="ghost" {...commonProps}>
    {@render icon()}
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem
    color="default"
    style="flat"
    {variant}
    subtitle={$isCover ? coverSubtitle : undefined}
    {...commonProps}
    {icon}
  >
    {m.button_text_set_cover_image()}
  </DropdownItem>
{/if}
