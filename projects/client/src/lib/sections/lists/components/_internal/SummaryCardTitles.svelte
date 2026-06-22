<script lang="ts">
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import { getLocale } from "$lib/features/i18n";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { toRelativeHumanDay } from "$lib/utils/formatting/date/toRelativeHumanDay";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { episodeSubtitle } from "$lib/utils/intl/episodeSubtitle";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";
  import type { MediaInputDefault, ShowInput } from "$lib/models/MediaInput";
  import type { EpisodeCardProps } from "../models/EpisodeCardProps";
  import type { MediaCardProps } from "../models/MediaCardProps";
  import type { SeasonCardProps } from "../models/SeasonCardProps";

  type EpisodeTitlesProps = { type: "episode" } & EpisodeCardProps;
  type SeasonTitlesProps = { type: "season" } & SeasonCardProps;
  type ItemTitlesProps = MediaCardProps | EpisodeTitlesProps | SeasonTitlesProps;

  type SummaryCardTitlesProps = DistributiveOmit<ItemTitlesProps, "media"> & {
    media: MediaInputDefault | ShowInput;
  };

  const { media, ...rest }: SummaryCardTitlesProps = $props();

  const isShowContext = $derived(
    rest.type === "episode" && "context" in rest && rest.context === "show",
  );

  const hasDistinctOriginalTitle = $derived(
    media.originalTitle
      ? media.title.toLowerCase() !== media.originalTitle.toLowerCase()
      : false,
  );
</script>

<div class="trakt-summary-card-titles">
  {#if rest.type === "season"}
    <p class="trakt-card-title ellipsis">
      {media.title}
    </p>
    <p class="trakt-card-subtitle small secondary ellipsis">
      {seasonLabel(rest.season.number)}
    </p>
  {:else if rest.variant === "activity"}
    {#if rest.type === "episode"}
      <p class="trakt-card-title ellipsis">
        {episodeSubtitle(rest.episode)}
        {#if !["multiple_episodes", "full_season"].includes(rest.episode.type)}
          <Spoiler media={rest.episode} show={media} type="episode">
            - {rest.episode.title}
          </Spoiler>
        {/if}
      </p>
    {:else}
      <p class="trakt-card-title ellipsis">
        {media.title}
      </p>
    {/if}
    <p class="trakt-card-subtitle small secondary ellipsis capitalize">
      {#if rest.activityType === "social"}
        {toRelativeHumanDay(new Date(), rest.date, getLocale())}
      {:else}
        {toHumanDate(new Date(), rest.date, getLocale())}
      {/if}
    </p>
  {:else if isShowContext && rest.type === "episode"}
    <p class="trakt-card-title ellipsis">
      <Spoiler media={rest.episode} show={media} type="episode">
        {rest.episode.title}
      </Spoiler>
    </p>
    <p class="trakt-card-subtitle small secondary ellipsis">
      {episodeSubtitle(rest.episode)}
    </p>
  {:else if rest.type === "episode" || (rest.variant === "start" && "episode" in rest)}
    <p class="trakt-card-title ellipsis">
      {media.title}
    </p>
    <p class="trakt-card-subtitle small secondary ellipsis">
      {episodeNumberLabel({
        seasonNumber: rest.episode.season,
        episodeNumber: rest.episode.number,
      })}
      {#if rest.variant !== "start"}
        <Spoiler media={rest.episode} show={media} type="episode">
          - {rest.episode.title}
        </Spoiler>
      {/if}
    </p>
  {:else if rest.variant === "credit"}
    <p class="trakt-card-title ellipsis">
      {media.title}
    </p>
    <p class="trakt-card-subtitle small secondary ellipsis">
      {rest.role}
    </p>
  {:else}
    <p class="trakt-card-title ellipsis">
      {media.title}
    </p>
    {#if hasDistinctOriginalTitle}
      <p class="secondary ellipsis">
        ({media.originalTitle})
      </p>
    {/if}
    <GenreList
      classList="trakt-card-subtitle small ellipsis secondary"
      separator=", "
      genres={media.genres}
    />
  {/if}
</div>

<style>
  .trakt-summary-card-titles {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
    min-height: var(--ni-66);
  }

  .trakt-card-title,
  .trakt-card-subtitle,
  :global(.trakt-card-subtitle) {
    padding-right: var(--ni-18);
  }

  .trakt-card-title {
    font-size: var(--font-size-title);
  }

  :global(.trakt-summary-card-minimal),
  :global(.trakt-summary-card-compact) {
    .trakt-card-title {
      font-size: var(--font-size-text);
    }
  }
</style>
