<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { type EpisodeType } from "$lib/models/EpisodeType";
  import { EPISODE_PLACEHOLDER } from "$lib/utils/constants";
  import EpisodeCard from "../card/EpisodeCard.svelte";
  import EpisodeCover from "../card/EpisodeCover.svelte";
  import type { EpisodeIntl } from "../EpisodeIntl";
  import EpisodeTimeTag from "../tags/EpisodeTimeTag.svelte";

  type EpisodeProps = {
    i18n: EpisodeIntl;
    posterUrl: string | Nil;
    showTitle: string;
    episodeTitle: string;
    episodeNumber: number;
    seasonNumber: number;
    airedDate: Date;
    type: EpisodeType;
    showHref?: string;
  };

  const {
    i18n,
    posterUrl,
    showTitle,
    episodeTitle,
    episodeNumber,
    seasonNumber,
    airedDate,
    type,
    showHref,
  }: EpisodeProps = $props();
</script>

<EpisodeCard>
  <EpisodeCover
    {i18n}
    {type}
    src={`${posterUrl ?? EPISODE_PLACEHOLDER}`}
    alt={`${showTitle} - ${episodeTitle}`}
  >
    {#snippet tags()}
      <EpisodeTimeTag>
        {i18n.timestampText(airedDate) ?? airedDate}
      </EpisodeTimeTag>
    {/snippet}
  </EpisodeCover>
  <CardFooter>
    <Link href={showHref}>
      <p class="episode-show-title ellipsis">{showTitle}</p>
    </Link>
    <p class="episode-title ellipsis small">
      {seasonNumber}x{episodeNumber} - {episodeTitle}
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
