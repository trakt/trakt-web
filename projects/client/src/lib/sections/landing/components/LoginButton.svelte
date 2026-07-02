<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const { login } = useAuth();
</script>

<div class="trakt-login-button">
  <Button
    label={m.button_label_login()}
    style="flat"
    size="small"
    color="default"
    navigationType={DpadNavigationType.Item}
    onclick={login}
  >
    {m.button_text_login()}
    {#snippet icon()}
      <LockIcon />
    {/snippet}
  </Button>
</div>

<style lang="scss">
  .trakt-login-button :global(.trakt-button[data-size=small]) {
    gap: var(--ni-12);
    padding: var(--ni-14) var(--ni-18);
    border: var(--ni-1) solid rgba(255, 255, 255, 0.14);
    border-radius: var(--ni-12);
    background: rgba(255, 255, 255, 0.07);
  }

  .trakt-login-button :global(.trakt-button[data-size=small]:hover) {
    --color-foreground-button: var(--color-foreground-default);
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.24);
  }
</style>
