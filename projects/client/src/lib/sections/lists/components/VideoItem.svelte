<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";

  const { video, slug }: { video: MediaVideo; slug: string } = $props();

  const { track } = useTrack(AnalyticsEvent.Extras);

  // FIXME: use embedded player for these and style cards accordingly
</script>

<LandscapeCard>
  <Link
    focusable={false}
    href={video.url}
    target="_blank"
    onclick={(ev) => {
      track({ slug, type: video.type });
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
