<script lang="ts">
  import AutoCloseButton from "$lib/components/buttons/AutoCloseButton.svelte";
  import { m } from "$lib/features/i18n/messages";
  import { fade } from "svelte/transition";

  const {
    children,
    hasSplashScreen,
    onDismiss,
  }: ChildrenProps & { hasSplashScreen: boolean; onDismiss: () => void } =
    $props();
</script>

{#if hasSplashScreen}
  <div class="trakt-seasonal-splash-screen" transition:fade={{ duration: 150 }}>
    {@render children()}
    <AutoCloseButton
      onclick={onDismiss}
      label={m.button_label_close()}
      style="flat"
      color="purple"
      --color-progress-ring="var(--shade-10)"
    />
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

    :global(.trakt-auto-close-button) {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(env(safe-area-inset-bottom, 0) + var(--ni-48));
    }
  }
</style>
