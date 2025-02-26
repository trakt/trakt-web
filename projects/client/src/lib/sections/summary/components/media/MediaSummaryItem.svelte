<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Link from "$lib/components/link/Link.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import { getLocale } from "$lib/features/i18n";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaInput } from "$lib/models/MediaInput";
  import type { MediaItemVariant } from "$lib/sections/lists/components/MediaCardProps";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";

  const {
    media,
    tags,
    badges,
    ...rest
  }: {
    tags?: Snippet<[MediaInput["media"]]>;
    action?: Snippet;
    badges?: Snippet;
  } & MediaItemVariant<MediaInput["media"]> = $props();

  const variant = $derived(rest.variant ?? "poster");
  const MAX_GENRE_COUNT = $derived(variant === "poster" ? 2 : 1);
</script>

<Link href={UrlBuilder.media(media.type, media.slug)} color="inherit">
  <div class="trakt-summary-item" data-variant={variant}>
    <div class="trakt-summary-item-image">
      {#if badges}
        <div class="trakt-summary-item-badges">
          {@render badges()}
        </div>
      {/if}

      {#if variant === "poster"}
        <CrossOriginImage alt={media.title} src={media.poster.url.thumb} />
      {/if}

      {#if variant === "thumb" || variant === "activity"}
        {#if rest.type === "episode"}
          <CrossOriginImage
            alt={rest.episode.title}
            src={rest.episode.cover.url ?? EPISODE_COVER_PLACEHOLDER}
          />
        {:else}
          <CrossOriginImage alt={media.title} src={media.thumb.url} />
        {/if}
      {/if}
    </div>

    <div class="trakt-summary-item-details">
      <span class="trakt-summary-media-title">
        {#if rest.type === "episode"}
          {rest.episode.season}x{rest.episode.number} - {media.title}
        {:else}
          {media.title} ({media.year ?? m.tba_label()})
        {/if}
      </span>
      <div class="meta-info">
        {#if rest.type !== "episode"}
          <InfoTag>
            {media.type}
          </InfoTag>
        {/if}

        {#if tags == null}
          {#if rest.type !== "episode" && media.runtime != null}
            <DurationTag i18n={TagIntlProvider} runtime={media.runtime} />
          {/if}

          {#if rest.type === "episode" && rest.episode.runtime != null}
            <DurationTag
              i18n={TagIntlProvider}
              runtime={rest.episode.runtime}
            />
          {/if}
        {:else}
          {@render tags(media)}
        {/if}
      </div>

      {#if rest.variant === "activity"}
        <p class="trakt-card-subtitle small ellipsis">
          {toHumanDate(new Date(), rest.date, getLocale())}
        </p>
      {:else}
        <GenreList genres={media.genres.slice(0, MAX_GENRE_COUNT)} />
      {/if}
    </div>
  </div>
</Link>

<style>
  .trakt-summary-item {
    padding: var(--ni-8);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    .trakt-summary-item-image {
      position: relative;

      :global(> img) {
        border: var(--border-thickness-xs) solid white;
        border-radius: var(--border-radius-s);

        box-sizing: border-box;
      }

      .trakt-summary-item-badges {
        --scale-factor: 0.75;
        --scaled-width: calc(100% * (1 / var(--scale-factor)));
        --width-difference: calc(100% - var(--scaled-width));

        z-index: var(--layer-raised);

        position: absolute;
        display: inline-flex;
        justify-content: flex-end;
        width: var(--scaled-width);
        padding: var(--ni-8);
        box-sizing: border-box;

        transform: scale(var(--scale-factor));
        margin-top: var(--ni-neg-4);
        margin-left: calc(var(--width-difference) / 2);
      }
    }

    :global(> img) {
      outline: var(--border-thickness-xs) solid white;
      border-radius: var(--border-radius-s);
    }

    &[data-variant="thumb"],
    &[data-variant="activity"] {
      :global(.trakt-summary-item-image > img) {
        height: var(--ni-88);
        width: var(--ni-156);
      }

      .trakt-summary-media-title {
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }

    &[data-variant="poster"] {
      :global(.trakt-summary-item-image > img) {
        height: var(--ni-120);
        width: var(--ni-80);
      }

      .trakt-summary-media-title {
        -webkit-line-clamp: 3;
        line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }

    .trakt-summary-item-details {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      gap: var(--gap-s);
      overflow: hidden;

      .trakt-summary-media-title {
        overflow: hidden;
        display: -webkit-box;
      }

      .meta-info {
        display: flex;
        gap: var(--gap-xxs);
      }

      :global(.trakt-summary-genre) {
        white-space: nowrap;
        scale: 0.8;
        transform-origin: left;
      }
    }
  }
</style>
