<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import Card from "$lib/components/card/Card.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import Link from "$lib/components/link/Link.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import SummaryCardBackgroundImage from "./_internal/SummaryCardBackgroundImage.svelte";
  import SummaryCardBottomBar from "./_internal/SummaryCardBottomBar.svelte";
  import SummaryCardDetails from "./_internal/SummaryCardDetails.svelte";
  import SummaryCardRating from "./_internal/SummaryCardRating.svelte";
  import type { EpisodeCardProps, MediaCardProps } from "./MediaCardProps";

  const {
    tag,
    action,
    badge,
    popupActions,
    media,
    source,
    ...rest
  }: MediaCardProps | EpisodeCardProps = $props();

  const { track } = useTrack(AnalyticsEvent.SummaryDrilldown);

  const coverData = $derived({
    background:
      rest.type === "episode"
        ? (rest.episode.cover.url ?? EPISODE_COVER_PLACEHOLDER)
        : media.cover.url.thumb,
    poster: media.poster.url.thumb,
    title: rest.type === "episode" ? rest.episode.title : media.title,
  });
</script>

<Card
  classList="trakt-summary-card"
  --height-card="var(--height-summary-card)"
  --height-card-cover="var(--height-summary-card-cover)"
  --width-card="var(--width-summary-card)"
  --poster-aspect-ratio="0.6667"
>
  {#if popupActions}
    <CardActionBar>
      {#snippet actions()}
        <PopupMenu label={m.button_label_popup_menu({ title: media.title })}>
          {#snippet items()}
            {@render popupActions()}
          {/snippet}
        </PopupMenu>
      {/snippet}
    </CardActionBar>
  {/if}

  <SummaryCardBackgroundImage
    src={coverData.background}
    alt={`Background for ${coverData.title}`}
  />

  <Link
    href={UrlBuilder.media(media.type, media.slug)}
    onclick={() => source && track({ source, type: rest.type })}
  >
    <div class="trakt-summary-poster">
      <CardCover
        title={coverData.title}
        alt={`Poster for ${coverData.title}`}
        src={coverData.poster}
      />
    </div>

    <SummaryCardDetails>
      {#if rest.variant === "activity"}
        {#if rest.type === "episode"}
          <p class="trakt-card-title ellipsis">
            {episodeActivityTitle(rest.episode, media)}
          </p>
        {:else}
          <p class="trakt-card-title ellipsis">
            {media.title}
          </p>
        {/if}
        <p class="trakt-card-subtitle small secondary ellipsis">
          {#if rest.type === "episode"}
            {EpisodeIntlProvider.timestampText({
              type: rest.episode.type,
              date: rest.date,
            })}
          {:else}
            {toHumanDate(new Date(), rest.date, getLocale())}
          {/if}
        </p>
      {:else if rest.type === "episode"}
        <p class="trakt-card-title ellipsis">
          {episodeNumberLabel({
            seasonNumber: rest.episode.season,
            episodeNumber: rest.episode.number,
          })} - {media.title}
        </p>
        <p class="trakt-card-subtitle small secondary ellipsis">
          {rest.episode.title}
        </p>
      {:else}
        <p class="trakt-card-title ellipsis">
          {media.title}
        </p>
        <GenreList
          classList="trakt-card-subtitle smaller ellipsis secondary"
          separator=", "
          genres={media.genres}
        />
      {/if}
    </SummaryCardDetails>
  </Link>

  <SummaryCardBottomBar>
    <div class="trakt-summary-card-tags">
      {@render tag?.()}
    </div>

    {#if action}
      {@render action()}
    {/if}

    {#if badge}
      {@render badge()}
    {/if}

    {#if !action && rest.variant !== "activity"}
      <SummaryCardRating
        item={rest.type === "episode" ? rest.episode : media}
      />
    {/if}
  </SummaryCardBottomBar>
</Card>

<style>
  :global(.trakt-summary-card) {
    :global(p.trakt-card-subtitle) {
      color: var(--color-text-secondary);
    }

    :global(.trakt-card-content),
    :global(.trakt-card-content > .trakt-link) {
      display: flex;
      flex-grow: 1;
      text-decoration: none;
      overflow: hidden;
    }
  }

  .trakt-summary-poster {
    height: var(--height-summary-card-cover);
    width: calc(var(--height-summary-card-cover) * var(--poster-aspect-ratio));

    flex-shrink: 0;
  }

  .trakt-summary-card-tags {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    flex-grow: 1;
  }
</style>
