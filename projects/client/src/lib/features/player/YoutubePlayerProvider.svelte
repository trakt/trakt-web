<script lang="ts">
  import { asset } from "$app/paths";
  import { time } from "$lib/utils/timing/time";
  import { createPlyr } from "./_internal/createPlyr.ts";
  import { createPlayerContext } from "./_internal/createYoutubePlayerContext.ts";

  const { embedId, isLoading, shouldAutoplay } = createPlayerContext();
  const { children } = $props();

  function initializePlyr(node: HTMLElement) {
    const autoplay = $shouldAutoplay;

    const options: Plyr.Options = {
      controls: ["play", "progress", "current-time", "mute", "fullscreen"],
      iconUrl: asset("/plyr/plyr.svg"),
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

    isLoading.next(true);
    const instance = createPlyr(node, options);

    const handlePauseVideo = () => {
      shouldAutoplay.next(false);
    };
    const handleExitVideo = () => {
      instance.stop();
      embedId.next(null);
      handlePauseVideo();
    };
    /**
     * `instance.fullscreen.enter()` calls `Element.requestFullscreen` under
     * the hood. Safari rejects that promise with `TypeError: Cannot request
     * fullscreen without transient activation` once the originating user
     * gesture has expired (any awaited microtask is enough). Plyr does not
     * surface the promise, so we both gate on `navigator.userActivation`
     * before calling and `await` to absorb a rejection if a future Plyr
     * version starts returning it.
     */
    const enterFullscreenSafely = async () => {
      if (navigator.userActivation?.isActive === false) return;

      try {
        await instance.fullscreen.enter();
      } catch {
        // user activation expired - render inline instead
      }
    };

    const handleReady = () => {
      isLoading.next(false);

      if (autoplay) {
        void enterFullscreenSafely();
        instance.play();
      }
    };
    const handlePreloadPlay = async (play: boolean) => {
      if (!play) return;

      /**
       * On iOS the ready event might have not fired yet, so we need to wait
       */
      while (isLoading.value) {
        await new Promise((resolve) => setTimeout(resolve, time.fps(24)));
      }

      await enterFullscreenSafely();
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

        instance.off("pause", handlePauseVideo);
        instance.off("ended", handleExitVideo);
        instance.off("ready", handleReady);
        teardownPreloadPlay.unsubscribe();

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
