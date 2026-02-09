<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import { useAllPersonalLists } from "$lib/stores/useAllPersonalLists";
  import { useIsListed } from "$lib/stores/useIsListed";

  type ListActionProps = {
    size?: "normal" | "small";
    style?: "normal" | "action" | "dropdown-item";
    variant?: "primary" | "secondary";
    title: string;
    media: MediaEntry;
    onClick: () => void;
    disabled?: boolean;
  };

  const {
    size,
    style = "normal",
    variant = "secondary",
    title,
    media,
    onClick,
    disabled,
  }: ListActionProps = $props();

  const { isLoading } = $derived(useIsListed(media));

  const isDisabled = $derived(disabled || $isLoading);

  const { lists } = useAllPersonalLists();
  const hasLists = $derived($lists.length > 0);
</script>

{#if hasLists}
  {#if style === "normal"}
    <Button
      style="flat"
      color="blue"
      {size}
      {variant}
      label={m.dropdown_label_add_remove_from_lists({ title })}
      disabled={isDisabled}
      onclick={onClick}
    >
      {m.button_text_manage_lists()}

      {#snippet icon()}
        <ListIcon />
      {/snippet}
    </Button>
  {/if}

  {#if style === "action"}
    <ActionButton
      label={m.dropdown_label_add_remove_from_lists({ title })}
      onclick={onClick}
      style="ghost"
      disabled={isDisabled}
    >
      <ListIcon />
    </ActionButton>
  {/if}

  {#if style === "dropdown-item"}
    <DropdownItem
      {variant}
      onclick={onClick}
      style="flat"
      color="default"
      label={m.dropdown_label_add_remove_from_lists({ title })}
      disabled={isDisabled}
    >
      {`${m.button_text_manage_lists()}…`}
      {#snippet icon()}
        <ListIcon />
      {/snippet}
    </DropdownItem>
  {/if}
{/if}
