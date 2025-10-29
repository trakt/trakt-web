<script lang="ts">
  import { writable } from "svelte/store";
  import { createPlayerContext } from "./_internal/createPlayerContext";

  const { embedId, isLoading } = createPlayerContext();
  const { children } = $props();
  const isFullscreen = writable(false);

  function initializePlyr(node: HTMLElement) {
    const PlyrClass = (globalThis as any).Plyr;

    const options: Plyr.Options = {
      controls: ["play", "progress", "current-time", "mute", "fullscreen"],
      autoplay: true,
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: false,
      },
      quality: {
        default: 1080,
        forced: true,
        options: [720, 1080],
      },
    };

    isLoading.set(true);
    const instance = new PlyrClass(node, options) as Plyr;

    const handleStartVideo = () => isFullscreen.set(true);
    const handleExitVideo = () => {
      isFullscreen.set(false);
      instance.stop();
      embedId.set(null);
    };
    const handleReady = () => {
      isLoading.set(false);
      instance.fullscreen.enter();
    };

    instance.on("enterfullscreen", handleStartVideo);
    instance.on("exitfullscreen", handleExitVideo);
    instance.on("ended", handleExitVideo);
    instance.on("ready", handleReady);

    return {
      destroy() {
        instance.off("enterfullscreen", handleStartVideo);
        instance.off("exitfullscreen", handleExitVideo);
        instance.on("ended", handleExitVideo);
        instance.off("ready", handleReady);
        instance.destroy();
      },
    };
  }
</script>

{#if $embedId}
  <div hidden={!$isFullscreen}>
    <div
      id="player"
      use:initializePlyr
      data-plyr-provider="youtube"
      data-plyr-embed-id={$embedId}
    ></div>
  </div>
{/if}

{@render children()}
