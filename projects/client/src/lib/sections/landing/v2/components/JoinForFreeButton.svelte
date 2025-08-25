<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useLoginTarget } from "$lib/sections/navbar/components/useLoginTarget";

  const { target } = useLoginTarget();
</script>

<trakt-join-for-free-button>
  <Button
    color="purple"
    label={m.button_label_join_trakt()}
    style="flat"
    navigationType={DpadNavigationType.Item}
    {...$target}
  >
    {m.button_text_join_trakt_for_free()}
  </Button>
</trakt-join-for-free-button>

<style>
  trakt-join-for-free-button {
    :global(.trakt-button) {
      position: relative;
      overflow: visible;
      width: 100%;

      &:before {
        --glow-size: var(--ni-2);

        content: "";

        position: absolute;
        top: calc(-1 * var(--glow-size));
        left: calc(-1 * var(--glow-size));

        width: calc(100% + 2 * var(--glow-size));
        height: calc(100% + 2 * var(--glow-size));

        background: linear-gradient(
          45deg,
          var(--purple-500),
          var(--purple-300),
          var(--purple-100),
          var(--purple-400),
          var(--purple-700),
          var(--purple-800),
          var(--purple-900),
          var(--purple-700),
          var(--purple-500)
        );
        background-size: 400%;

        z-index: var(--layer-background);
        filter: blur(var(--ni-4));

        animation: shift-background 20s linear infinite;
        opacity: 1;
      }

      @keyframes shift-background {
        0% {
          background-position: 0 0;
        }
        50% {
          background-position: 400% 0;
        }
        100% {
          background-position: 0 0;
        }
      }
    }
  }
</style>
