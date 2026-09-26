<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const { login } = useAuth();
</script>

<div class="trakt-get-started-button">
  <Button
    label={m.button_label_get_started()}
    style="flat"
    color="custom"
    navigationType={DpadNavigationType.Item}
    onclick={login}
    --color-background-custom="var(--purple-500)"
    --color-foreground-custom="var(--shade-10)"
  >
    {m.button_text_get_started()}
  </Button>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-get-started-button {
    display: contents;

    :global(.trakt-button) {
      margin-block-start: calc(var(--ni-36) - var(--gap-l));
      padding: 0 var(--ni-28);
      border-radius: var(--landing-radius-pill);

      @include for-tablet-sm-and-below {
        margin-block-start: calc(var(--ni-32) - var(--gap-m));
      }
    }

    :global(.trakt-button .button-label p) {
      font-size: var(--ni-16);
      font-weight: 700;
    }
  }

  @include for-mouse {
    .trakt-get-started-button
      :global(.trakt-button[data-style="flat"][data-color="custom"][data-variant="primary"]:hover),
    .trakt-get-started-button
      :global(
        .trakt-button[data-style="flat"][data-color="custom"][data-variant="primary"]:focus-visible
      ) {
      --color-background-button: var(--purple-600);
      --color-foreground-button: var(--shade-10);
    }
  }
</style>
