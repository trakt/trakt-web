<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import { fade } from "svelte/transition";
  import { autoDismiss } from "./autoDismiss";

  const {
    children,
    hasSplashScreen,
    onDismiss,
  }: ChildrenProps & { hasSplashScreen: boolean; onDismiss: () => void } =
    $props();
</script>

{#if hasSplashScreen}
  <div
    class="trakt-seasonal-splash-screen"
    transition:fade={{ duration: 150 }}
    use:autoDismiss={{ onDismiss }}
  >
    {@render children()}
    <div class="trakt-splash-close-button">
      <ActionButton
        color="purple"
        onclick={onDismiss}
        label="close"
        size="small"
      >
        <CloseIcon />
      </ActionButton>
    </div>
  </div>
{/if}

<style>
  .trakt-seasonal-splash-screen {
    position: fixed;
    z-index: var(--layer-top);

    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    background: radial-gradient(
      117.94% 117.94% at 50% 100%,
      #131517 24%,
      rgba(19, 21, 23, 0.8) 64%,
      rgba(19, 21, 23, 0.64) 100%
    );

    :global(svg) {
      max-width: 100vw;
      max-height: 100vh;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .trakt-splash-close-button {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(env(safe-area-inset-bottom, 0) + var(--ni-48));

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: var(--ni-36);
        height: var(--ni-36);
        border-radius: 50%;
        background: conic-gradient(
          var(--shade-10) calc(var(--progress, 0) * 360deg),
          transparent 0deg 360deg
        );

        pointer-events: none;
        z-index: -1;
      }

      :global(.trakt-action-button) {
        border-radius: 50%;
      }
    }
  }
</style>
