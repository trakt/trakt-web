<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { usePlayer } from "$lib/features/player/stores/usePlayer";
  import { getWebOSHandler } from "$lib/features/web-os/getWebOSHandler";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";

  const { video, slug }: { video: MediaVideo; slug: string } = $props();

  const { track } = useTrack(AnalyticsEvent.Extras);

  const webOSHandler = getWebOSHandler();
  const { play, preload } = usePlayer();

  preload(video.url);
</script>

<LandscapeCard>
  <Link
    focusable={false}
    href="javascript:void(0);"
    onclick={(ev) => {
      track({ slug, type: video.type });

      if (!webOSHandler) {
        play(video.url);
        return;
      }

      ev.preventDefault();
      webOSHandler.youtube(video.url);
    }}
  >
    <CardCover title={video.title} src={video.thumbnail} alt={video.title} />
  </Link>
  <CardFooter>
    <p use:lineClamp={{ lines: 2 }} class="trakt-card-title trakt-video-title">
      {video.title}
    </p>
  </CardFooter>
</LandscapeCard>

<style>
  .trakt-video-title {
    line-height: var(--ni-16);
  }
</style>
