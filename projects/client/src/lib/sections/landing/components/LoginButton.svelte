<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
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
    color="custom"
    navigationType={DpadNavigationType.Item}
    onclick={login}
    --color-background-custom="color-mix(in srgb, var(--shade-10) 7%, transparent)"
    --color-foreground-custom="var(--shade-10)"
  >
    {m.button_text_login()}
  </Button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-login-button {
    display: contents;

    :global(.trakt-button) {
      justify-content: center;

      padding: var(--ni-10) var(--ni-20);
      border-radius: var(--landing-radius-pill);
      box-shadow: inset 0 0 0 var(--ni-1) var(--landing-color-stroke);

      @include backdrop-filter-blur(var(--ni-12));
    }
  }

  @include for-mouse {
    .trakt-login-button :global(.trakt-button:hover) {
      --color-background-button: color-mix(
        in srgb,
        var(--shade-10) 12%,
        transparent
      );
      --color-foreground-button: var(--shade-10);
    }
  }
</style>
