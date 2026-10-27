<script lang="ts">
  import DropdownGroup from "$lib/components/dropdown/DropdownGroup.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import CoverImageIcon from "$lib/components/icons/CoverImageIcon.svelte";
  import DeleteIcon from "$lib/components/icons/DeleteIcon.svelte";
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { Popover } from "bits-ui";
  import type { Snippet } from "svelte";

  const {
    trigger,
    onViewPhoto,
    onUploadPhoto,
    onRemovePhoto,
  }: {
    trigger: Snippet<[Record<string, unknown>]>;
    onViewPhoto: () => void;
    onUploadPhoto: () => void;
    onRemovePhoto: () => void;
  } = $props();

  let open = $state(false);

  const closeAnd = (action: () => void) => () => {
    open = false;
    action();
  };
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      {@render trigger(props)}
    {/snippet}
  </Popover.Trigger>
  <Popover.Portal>
    <Popover.Content
      class="trakt-profile-image-context-menu"
      sideOffset={8}
      align="center"
    >
      <DropdownGroup style="menu">
        <DropdownItem
          onclick={closeAnd(onViewPhoto)}
          label={m.button_label_view_photo()}
        >
          {m.button_text_view_photo()}
          {#snippet icon()}
            <ProfileIcon />
          {/snippet}
        </DropdownItem>

        <DropdownItem
          onclick={closeAnd(onUploadPhoto)}
          label={m.button_label_upload_photo()}
        >
          {m.button_text_upload_photo()}
          {#snippet icon()}
            <CoverImageIcon />
          {/snippet}
        </DropdownItem>
      </DropdownGroup>

      <hr class="menu-divider" />

      <DropdownGroup style="menu">
        <DropdownItem
          color="red"
          onclick={closeAnd(onRemovePhoto)}
          label={m.button_label_remove_photo()}
        >
          {m.button_text_remove_photo()}
          {#snippet icon()}
            <DeleteIcon />
          {/snippet}
        </DropdownItem>
      </DropdownGroup>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-profile-image-context-menu) {
    z-index: var(--layer-top);
    min-width: var(--ni-200);

    animation: menuIn var(--transition-increment) ease-out forwards;

    @include floating-list;
  }

  @keyframes menuIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .menu-divider {
    all: unset;
    display: block;
    height: var(--border-thickness-xxs);
    background-color: var(--color-option-list-separator);
    margin: var(--ni-4) var(--ni-8);
  }
</style>
