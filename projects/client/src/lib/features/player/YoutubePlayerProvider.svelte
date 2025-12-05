<script lang="ts">
  import { time } from "$lib/utils/timing/time";
  import { get } from "svelte/store";
  import { createPlyr } from "./_internal/createPlyr.ts";
  import { createPlayerContext } from "./_internal/createYoutubePlayerContext.ts";

  const { embedId, isLoading, shouldAutoplay } = createPlayerContext();
  const { children } = $props();

  function initializePlyr(node: HTMLElement) {
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
    const instance = createPlyr(node, options);

    const handlePauseVideo = () => {
      shouldAutoplay.set(false);
    };
    const handleExitVideo = () => {
      instance.stop();
      embedId.set(null);
      handlePauseVideo();
    };
    const handleReady = () => {
      isLoading.set(false);

      if (autoplay) {
        instance.fullscreen.enter();
        instance.play();
      }
    };
    const handlePreloadPlay = async (play: boolean) => {
      if (!play) return;

      /**
       * On iOS the ready event might have not fired yet, so we need to wait
       */
      while (get(isLoading)) {
        await new Promise((resolve) => setTimeout(resolve, time.fps(24)));
      }

      instance.fullscreen.enter();
      await instance.play();
    };

    /** BEGIN: iOS does not emit */
    instance.on("exitfullscreen", handleExitVideo);
    /** END: iOS does not emit */

    instance.on("pause", handlePauseVideo);
    instance.on("ended", handleExitVideo);
    instance.on("ready", handleReady);
    const teardownPreloadPlay = shouldAutoplay.subscribe(handlePreloadPlay);

    return {
      destroy() {
        instance.off("exitfullscreen", handleExitVideo);

        instance.on("pause", handlePauseVideo);
        instance.on("ended", handleExitVideo);
        instance.off("ready", handleReady);
        teardownPreloadPlay();

        instance.destroy();
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
