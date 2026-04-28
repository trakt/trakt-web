<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import LogoutIcon from "$lib/components/icons/LogoutIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import { ConfirmationType } from "$lib/features/confirmation/models/ConfirmationType";
  import { useConfirm } from "$lib/features/confirmation/useConfirm";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import ActionButton from "../ActionButton.svelte";

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
  <Button
    size="small"
    style="flat"
    variant="secondary"
    navigationType={DpadNavigationType.Item}
    color="red"
    {...commonProps}
  >
    {m.button_text_logout()}
  </Button>
{/if}

{#if style === "action"}
  <div class="trakt-logout-action-button">
    <ActionButton {...commonProps} style="ghost" color="red">
      <LogoutIcon />
    </ActionButton>
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

  .trakt-logout-action-button {
    --color-logout-button: var(--color-background-red);

    :global(
      .trakt-action-button[data-style="ghost"][data-variant="primary"][data-color="red"]
    ) {
      --color-foreground-action-button: var(--color-logout-button);

      @include for-mouse {
        &:hover {
          background-color: color-mix(
            in srgb,
            var(--color-logout-button) 10%,
            transparent
          );
        }
      }
    }
  }
</style>
