<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import Card from "$lib/components/card/Card.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { EpisodeCardProps, MediaCardProps } from "./MediaCardProps";

  const {
    tag,
    action,
    badge,
    popupActions,
    media,
    ...rest
  }: MediaCardProps | EpisodeCardProps = $props();
</script>

<Card
  variant="transparent"
  --height-card="var(--height-summary-card)"
  --height-card-cover="var(--height-summary-card-cover)"
  --width-card="var(--width-summary-card)"
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

  <Link href={UrlBuilder.media(media.type, media.slug)} color="inherit">
    {#if rest.type === "episode"}
      <CardCover
        {badge}
        {tag}
        title={rest.episode.title}
        alt={rest.episode.title}
        src={rest.episode.cover.url ?? EPISODE_COVER_PLACEHOLDER}
      />
    {/if}

    {#if rest.type === "movie"}
      <CardCover
        {badge}
        {tag}
        title={media.title}
        alt={media.title}
        src={media.thumb.url}
      />
    {/if}

    {#if rest.type === "show"}
      <CardCover
        {badge}
        {tag}
        title={media.title}
        alt={media.title}
        src={media.cover.url.thumb}
      />
    {/if}
  </Link>

  <CardFooter {action}>
    {#if rest.variant === "activity"}
      {#if rest.type === "episode"}
        <p class="trakt-card-title small ellipsis">
          {episodeNumberLabel({
            seasonNumber: rest.episode.season,
            episodeNumber: rest.episode.number,
          })} - {media.title}
        </p>
      {:else}
        <p class="trakt-card-title small ellipsis">
          {media.title}
        </p>
      {/if}
      <p class="trakt-card-subtitle small ellipsis">
        {toHumanDate(new Date(), rest.date, getLocale())}
      </p>
    {:else if rest.type === "episode"}
      <p class="trakt-card-title small ellipsis">
        {episodeNumberLabel({
          seasonNumber: rest.episode.season,
          episodeNumber: rest.episode.number,
        })} - {media.title}
      </p>
      <p class="trakt-card-subtitle small ellipsis">
        {rest.episode.title}
      </p>
    {:else}
      <p class="trakt-card-title small ellipsis">
        {media.title}
      </p>
      <GenreList
        classList="trakt-card-subtitle small ellipsis"
        separator=", "
        genres={media.genres}
      />
    {/if}
  </CardFooter>
</Card>
