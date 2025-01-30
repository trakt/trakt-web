<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";

  const {
    episode,
    show,
    tags,
    action,
  }: {
    episode: EpisodeEntry;
    show: ShowEntry;
    tags?: Snippet;
    action?: Snippet;
  } = $props();

  const src = $derived(useEpisodeSpoilerImage({ episode, show }));
</script>

<trakt-episode-summary-card>
  <Card
    --height-card="var(--height-episode-summary-card)"
    --width-card="var(--width-summary-card)"
  >
    <Link
      href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
      color="inherit"
    >
      <div class="trakt-summary-item">
        <CrossOriginImage
          alt={`${show.title} - ${episode.title}`}
          src={$src ?? EPISODE_COVER_PLACEHOLDER}
        />
        <div class="trakt-summary-item-details">
          <p class="ellipsis">
            {show.title}
          </p>
          <p class="subtitle ellipsis small">
            {episode.season}x{episode.number}
            <Spoiler media={episode} {show} {episode} type="episode">
              - {episode.title}
            </Spoiler>
          </p>
          {#if tags}
            <div class="meta-info">
              {@render tags()}
            </div>
          {/if}
        </div>
      </div>
    </Link>
    <CardFooter {action} />
  </Card>
</trakt-episode-summary-card>

<style>
  trakt-episode-summary-card {
    :global(.trakt-card .trakt-card-footer) {
      padding: 0;
    }

    :global(.trakt-card .trakt-summary-item) {
      padding: var(--ni-12);
    }
  }

  .trakt-summary-item {
    padding: var(--ni-8);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    :global(img) {
      height: var(--ni-88);
      width: var(--ni-156);

      border: var(--border-thickness-xs) solid white;
      border-radius: var(--border-radius-s);

      box-sizing: border-box;
    }

    .trakt-summary-item-details {
      display: grid;
      gap: var(--gap-xs);

      .subtitle {
        color: var(--color-text-secondary);
      }

      .meta-info {
        display: flex;
        gap: var(--gap-xxs);
      }
    }
  }
</style>
