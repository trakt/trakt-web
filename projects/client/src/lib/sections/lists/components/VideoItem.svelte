<script lang="ts">
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import type { MediaVideo } from "$lib/requests/models/MediaVideo";

  const { video }: { video: MediaVideo } = $props();
</script>

<LandscapeCard>
  <Link focusable={false} href={video.url} target="_blank">
    <CardCover
      title={video.title}
      src={video.thumbnail}
      alt={video.title}
      style="flat"
    />
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
