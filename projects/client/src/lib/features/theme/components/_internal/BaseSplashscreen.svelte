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
    inset-inline-start: 0;
    width: 100vw;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    background:
      radial-gradient(
        ellipse at 50% 40%,
        color-mix(in srgb, var(--purple-700) 45%, transparent) 0%,
        transparent 60%
      ),
      color-mix(in srgb, var(--shade-1000) 88%, transparent);
    backdrop-filter: blur(var(--ni-8));

    :global(.trakt-auto-close-button) {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(env(safe-area-inset-bottom, 0) + var(--ni-48));
    }
  }
</style>
