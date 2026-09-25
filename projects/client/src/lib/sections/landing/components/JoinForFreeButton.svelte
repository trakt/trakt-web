<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const { login } = useAuth();
</script>

<trakt-join-for-free-button>
  <Button
    color="custom"
    label={m.button_label_join_trakt()}
    style="flat"
    navigationType={DpadNavigationType.Item}
    onclick={login}
    --color-background-custom="var(--purple-500)"
    --color-foreground-custom="var(--shade-10)"
  >
    {m.button_text_join_trakt_for_free()}
  </Button>
</trakt-join-for-free-button>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-join-for-free-button {
    display: contents;

    :global(.trakt-button) {
      justify-content: center;

      padding: var(--ni-16) var(--ni-28);
      border-radius: var(--landing-radius-pill);

      background-image: linear-gradient(
        135deg,
        var(--purple-400),
        var(--purple-600)
      );
      box-shadow:
        0 var(--ni-8) var(--ni-30)
          color-mix(in srgb, var(--purple-500) 35%, transparent),
        inset 0 var(--ni-1) 0 color-mix(in srgb, var(--shade-10) 18%, transparent);

      font-weight: 700;
    }

    @include for-mouse {
      :global(.trakt-button:hover) {
        --color-background-button: var(--purple-500);
        --color-foreground-button: var(--shade-10);

        box-shadow:
          0 var(--ni-10) var(--ni-40)
            color-mix(in srgb, var(--purple-500) 60%, transparent),
          inset 0 var(--ni-1) 0
            color-mix(in srgb, var(--shade-10) 18%, transparent);
        transform: translateY(calc(-1 * var(--ni-1)));
      }
    }
  }
</style>
