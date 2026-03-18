<script lang="ts">
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
      class="profile-image-context-menu"
      sideOffset={8}
      align="center"
    >
      <button
        class="menu-item"
        onclick={closeAnd(onViewPhoto)}
        aria-label={m.button_label_view_photo()}
      >
        <ProfileIcon />
        <span>{m.button_text_view_photo()}</span>
      </button>

      <button
        class="menu-item"
        onclick={closeAnd(onUploadPhoto)}
        aria-label={m.button_label_upload_photo()}
      >
        <CoverImageIcon />
        <span>{m.button_text_upload_photo()}</span>
      </button>

      <hr class="menu-divider" />

      <button
        class="menu-item menu-item--destructive"
        onclick={closeAnd(onRemovePhoto)}
        aria-label={m.button_label_remove_photo()}
      >
        <DeleteIcon />
        <span>{m.button_text_remove_photo()}</span>
      </button>
    </Popover.Content>
  </Popover.Portal>
</Popover.Root>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.profile-image-context-menu) {
    z-index: var(--layer-top);
    background-color: var(--color-modal-background);
    border-radius: var(--border-radius-l);
    box-shadow: var(--shadow-menu);
    padding: var(--ni-8);
    min-width: var(--ni-200);
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    animation: menuIn var(--transition-increment) ease-out forwards;
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

  .menu-item {
    all: unset;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--ni-12);
    padding: var(--ni-12) var(--ni-16);
    border-radius: var(--border-radius-m);
    color: var(--color-text-primary);
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-normal);
    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 8%,
          transparent
        );
      }

      &:focus-visible {
        outline: var(--border-thickness-xs) solid var(--color-foreground);
        outline-offset: -2px;
      }
    }

    &--destructive {
      color: var(--color-background-red);
    }

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
      flex-shrink: 0;
    }
  }

  .menu-divider {
    all: unset;
    display: block;
    height: 1px;
    background-color: color-mix(
      in srgb,
      var(--color-foreground) 10%,
      transparent
    );
    margin: var(--ni-4) var(--ni-8);
  }
</style>
