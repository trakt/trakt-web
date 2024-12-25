<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import EpisodeCard from "$lib/components/episode/card/EpisodeCard.svelte";
  import EpisodeCover from "$lib/components/episode/card/EpisodeCover.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import EpisodeTimeTag from "$lib/components/episode/tags/EpisodeTimeTag.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import type { EpisodeEntry } from "$lib/models/EpisodeEntry";
  import type { MediaSummary } from "$lib/requests/models/MediaSummary";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type EpisodeProps = {
    episode: EpisodeEntry;
    show: MediaSummary;
  };

  const { show, episode }: EpisodeProps = $props();
</script>

<EpisodeCard>
  <EpisodeCover
    i18n={EpisodeIntlProvider}
    type={episode.type}
    src={`${episode.poster.url ?? show.cover.url.thumb ?? EPISODE_COVER_PLACEHOLDER}`}
    alt={`${show.title} - ${episode.title}`}
  >
    {#snippet tags()}
      <EpisodeTimeTag>
        {EpisodeIntlProvider.timestampText(episode.airedDate)}
      </EpisodeTimeTag>
    {/snippet}
  </EpisodeCover>
  <CardFooter>
    <Link href={UrlBuilder.show(show.slug)}>
      <p class="episode-show-title ellipsis">{show.title}</p>
    </Link>
    <p class="episode-title ellipsis small">
      {episode.season}x{episode.number} - {episode.title}
    </p>
  </CardFooter>
</EpisodeCard>

<style>
  .episode-show-title {
    color: var(--color-text-primary);
    margin: 0;

    font-weight: 600;
  }

  .episode-title {
    color: var(--color-text-secondary);
    margin: 0;

    font-weight: 500;
  }
</style>
