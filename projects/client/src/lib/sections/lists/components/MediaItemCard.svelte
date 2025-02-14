<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import PosterCard from "$lib/components/media/card/PosterCard.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";

  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import ActivityCard from "$lib/components/media/card/ActivityCard.svelte";
  import ThumbCard from "$lib/components/media/card/ThumbCard.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import EpisodeCountTag from "$lib/components/media/tags/EpisodeCountTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CardActionBar from "../../../components/card/CardActionBar.svelte";
  import type { MediaCardProps } from "./MediaCardProps";

  const {
    type,
    media,
    badges: externalBadges,
    tags: externalTags,
    action,
    popupActions,
    ...rest
  }: MediaCardProps = $props();

  const variant = $derived(rest.variant ?? "poster");
</script>

{#snippet defaultTags(media: MediaCardProps["media"])}
  {#if media.airDate > new Date()}
    <AirDateTag
      i18n={TagIntlProvider}
      year={media.year}
      airDate={media.airDate}
    />
  {:else if "episode" in media}
    <EpisodeCountTag i18n={TagIntlProvider} count={media.episode.count} />
  {:else if type === "movie" && variant !== "activity"}
    <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
  {/if}
{/snippet}

{#snippet content(mediaCoverImageUrl: string)}
  {#if popupActions}
    <CardActionBar>
      {#snippet actions()}
        <PopupMenu label={m.media_popup_label({ title: media.title })}>
          {#snippet items()}
            {@render popupActions()}
          {/snippet}
        </PopupMenu>
      {/snippet}
    </CardActionBar>
  {/if}

  <Link focusable={false} href={UrlBuilder.media(type, media.slug)}>
    <CardCover
      src={mediaCoverImageUrl}
      alt={m.media_poster({ title: media.title })}
    >
      {#snippet badges()}
        {@render externalBadges?.()}
      {/snippet}

      {#snippet tags()}
        {#if externalTags}
          {@render externalTags()}
        {:else}
          {@render defaultTags(media)}
        {/if}
      {/snippet}
    </CardCover>
  </Link>

  <CardFooter {action}>
    <Link href={UrlBuilder.media(type, media.slug)}>
      <p
        class="trakt-card-title small ellipsis"
        class:small={rest.variant !== "activity"}
      >
        {media.title}
      </p>
    </Link>
    {#if rest.variant === "activity"}
      <p class="trakt-card-subtitle small ellipsis">
        {toHumanDate(new Date(), rest.date, getLocale())}
      </p>
    {/if}
  </CardFooter>
{/snippet}

{#if variant === "poster"}
  <PosterCard>
    {@render content(media.poster.url.thumb)}
  </PosterCard>
{/if}

{#if variant === "thumb"}
  <ThumbCard>
    {@render content(media.thumb.url)}
  </ThumbCard>
{/if}

{#if variant === "activity"}
  <ActivityCard>
    {@render content(media.thumb.url)}
  </ActivityCard>
{/if}
