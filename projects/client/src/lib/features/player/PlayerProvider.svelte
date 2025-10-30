<script lang="ts">
  import { writable } from "svelte/store";
  import { createPlayerContext } from "./_internal/createPlayerContext";

  const { embedId, isLoading, shouldAutoplay } = createPlayerContext();
  const { children } = $props();
  const isFullscreen = writable(false);

  function initializePlyr(node: HTMLElement) {
    const PlyrClass = (globalThis as any).Plyr;

    const autoplay = $shouldAutoplay;

    const options: Plyr.Options = {
      controls: ["play", "progress", "current-time", "mute", "fullscreen"],
      autoplay,
      fullscreen: {
        enabled: true,
        fallback: true,
        iosNative: true,
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
      shouldAutoplay.set(false);
    };
    const handleReady = () => {
      isLoading.set(false);

      if (autoplay) {
        instance.fullscreen.enter();
      }
    };
    const handlePreloadPlay = async (play: boolean) => {
      if (autoplay) return;
      if (!play) return;

      instance.fullscreen.enter();
      await instance.play();
    };

    instance.on("enterfullscreen", handleStartVideo);
    instance.on("exitfullscreen", handleExitVideo);
    instance.on("ended", handleExitVideo);
    instance.on("ready", handleReady);
    const teardownPreloadPlay = shouldAutoplay.subscribe(handlePreloadPlay);

    return {
      destroy() {
        instance.off("enterfullscreen", handleStartVideo);
        instance.off("exitfullscreen", handleExitVideo);
        instance.on("ended", handleExitVideo);
        instance.off("ready", handleReady);
        instance.destroy();
        teardownPreloadPlay();
      },
    };
  }
</script>

<div
  style="position: absolute; top: -100dvh; left: -100dvw; width: 0; height: 0; overflow: hidden;"
>
  {#key $embedId}
    {#if $embedId}
      <div use:initializePlyr>
        <iframe
          title="Trakt Video Player"
          src="https://www.youtube.com/embed/{$embedId}?playsinline=0&enablejsapi=1&title=false"
          allowfullscreen
          allowtransparency
          allow="autoplay"
        >
        </iframe>
      </div>
    {/if}
  {/key}
</div>

{@render children()}
