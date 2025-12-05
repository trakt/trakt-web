<script lang="ts">
  import { createPlyr } from "./_internal/createPlyr";

  type VideoPlayerProps = {
    src: HttpsUrl;
  };

  const { src }: VideoPlayerProps = $props();

  $effect(() => {
    const instance = createPlyr("#video-player", {
      controls: ["play", "progress", "current-time", "mute", "fullscreen"],
      autoplay: true,
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
    });

    instance.source = {
      type: "video",
      sources: [
        {
          src,
          type: "video/mp4",
        },
      ],
    };
  });
</script>

{#if src != null}
  <!-- svelte-ignore a11y_media_has_caption -->
  <video id="video-player"></video>
{/if}
