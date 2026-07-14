<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import LogoutIcon from "$lib/components/icons/LogoutIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const {
    style = "normal",
  }: { style?: "normal" | "action" | "dropdown-item" } = $props();

  const { logout } = useAuth();

  const { confirm } = useConfirm();
  const confirmLogout = $derived(
    confirm({
      type: ConfirmationType.Logout,
      onConfirm: logout,
    }),
  );

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_logout(),
    onclick: confirmLogout,
  });
</script>

{#if style === "normal"}
  <button
    class="trakt-logout-button"
    type="button"
    aria-label={m.button_label_logout()}
    onclick={confirmLogout}
    data-dpad-navigation={DpadNavigationType.Item}
  >
    <span class="logout-icon"><LogoutIcon /></span>
    <span class="logout-label bold">{m.button_text_logout()}</span>
  </button>
{/if}

{#if style === "action"}
  <div class="trakt-logout-action">
    <Button
      style="ghost"
      variant="secondary"
      color="red"
      navigationType={DpadNavigationType.Item}
      {...commonProps}
    >
      {m.button_text_logout()}
      {#snippet icon()}
        <LogoutIcon />
      {/snippet}
    </Button>
  </div>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem {...commonProps} color="default" variant="primary" style="flat">
    {m.button_text_logout()}
    {#snippet icon()}
      <LogoutIcon />
    {/snippet}
  </DropdownItem>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  // The `action` logout renders the icon before the label (the shared Button
  // otherwise trails the icon after the text).
  .trakt-logout-action {
    :global(.trakt-button .button-icon) {
      order: -1;
    }
  }

  // The `normal` logout mirrors the settings card rows: a full-width card with a
  // circular red-tinted icon badge and a red label, so it reads as a distinct
  // destructive action rather than a solid filled block.
  .trakt-logout-button {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    width: 100%;
    box-sizing: border-box;
    min-height: var(--ni-64);
    padding: var(--gap-s) var(--gap-m);

    border: none;
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);
    box-shadow: var(--shadow-base);

    cursor: pointer;
    text-align: start;
    -webkit-tap-highlight-color: transparent;

    transition: background var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background: color-mix(
          in srgb,
          var(--color-foreground) 5%,
          var(--color-card-background)
        );
      }
    }

    &:active {
      background: color-mix(
        in srgb,
        var(--color-foreground) 8%,
        var(--color-card-background)
      );
    }
  }

  .logout-icon {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-36);
    height: var(--ni-36);

    border-radius: 50%;
    background: color-mix(in srgb, var(--color-background-red) 15%, transparent);
    color: var(--color-background-red);

    :global(svg) {
      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .logout-label {
    color: var(--color-background-red);
    line-height: 1.3;
  }
</style>
