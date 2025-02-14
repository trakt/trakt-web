<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Link from "$lib/components/link/Link.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import InfoTag from "$lib/components/media/tags/InfoTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import GenreList from "$lib/components/summary/GenreList.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MediaInput } from "$lib/models/MediaInput";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";

  const {
    media,
    tags,
    badges,
    retrigger = true,
    variant = "poster",
    ...rest
  }: {
    tags?: Snippet<[MediaInput["media"]]>;
    action?: Snippet;
    badges?: Snippet;
    retrigger?: boolean;
    variant?: "thumb" | "poster" | "activity";
  } & MediaInput = $props();

  const MAX_GENRE_COUNT = variant === "poster" ? 2 : 1;
</script>

<Link
  href={UrlBuilder.media(media.type, media.slug)}
  {retrigger}
  color="inherit"
>
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

      {#if variant === "thumb"}
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
        <InfoTag>
          {media.type}
        </InfoTag>

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

      <GenreList genres={media.genres.slice(0, MAX_GENRE_COUNT)} />
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

    &[data-variant="thumb"] {
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
