<script lang="ts">
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import type { NowPlayingItem } from "$lib/requests/models/NowPlayingItem.ts";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/assets";
  import { of } from "rxjs";

  const { nowPlaying }: { nowPlaying: NowPlayingItem } = $props();

  const src = $derived(
    nowPlaying.type === "episode"
      ? useEpisodeSpoilerImage({
          episode: nowPlaying.media,
          show: nowPlaying.show,
          variant: "activity",
        })
      : of(nowPlaying.media.cover.url.medium),
  );
</script>

<div class="trakt-watching-now-cover">
  <CrossOriginImage src={$src ?? EPISODE_COVER_PLACEHOLDER} alt="" />
</div>

<style lang="scss">
  .trakt-watching-now-cover {
    width: 100%;
    height: 100%;
    background: var(--color-background-default);

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
