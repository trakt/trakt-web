<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LogoutIcon from "$lib/components/icons/LogoutIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import ActionButton from "../ActionButton.svelte";

  const { style = "normal" }: { style?: "normal" | "action" } = $props();

  const { logout } = useAuth();

  const commonProps: Omit<ButtonProps, "children"> = $derived({
    label: m.button_label_logout(),
    color: "red",
    onclick: logout,
  });
</script>

{#if style === "normal"}
  <Button
    size="small"
    style="flat"
    navigationType={DpadNavigationType.Item}
    {...commonProps}
  >
    {m.button_text_logout()}
  </Button>
{/if}

{#if style === "action"}
  <ActionButton variant="secondary" {...commonProps}>
    <LogoutIcon />
  </ActionButton>
{/if}
