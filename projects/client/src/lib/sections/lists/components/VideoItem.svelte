<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import { getDeepLinkHandler } from "$lib/features/deep-link/getDeepLinkHandler";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";

  const {
    video,
    trackHandler,
  }: { video: MediaVideo; trackHandler: () => void } = $props();

  const deepLinkHandler = getDeepLinkHandler();
</script>

<LandscapeCard>
  <Link
    focusable={false}
    href={video.url}
    target="_blank"
    onclick={(ev) => {
      trackHandler();

      if (!deepLinkHandler) {
        return;
      }
      ev.preventDefault();
      deepLinkHandler.open("YouTube", video.url);
    }}
  >
    <CardCover title={video.title} src={video.thumbnail} alt={video.title} />
    <CardFooter>
      <p
        use:lineClamp={{ lines: 2 }}
        class="trakt-card-title trakt-video-title"
      >
        {video.title}
      </p>
    </CardFooter>
  </Link>
</LandscapeCard>

<style>
  .trakt-video-title {
    line-height: var(--ni-16);
  }
</style>
