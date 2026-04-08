<script lang="ts">
  import { m } from "$lib/features/i18n/messages.ts";
  import type { MediaEntry } from "$lib/requests/models/MediaEntry";
  import ExternalLinkAction from "../../_internal/ExternalLinkAction.svelte";

  const { media }: { media: MediaEntry } = $props();

  const facebookId = $derived(media.socialMedia?.facebook);
  const xId = $derived(media.socialMedia?.x);
  const instagramId = $derived(media.socialMedia?.instagram);
  const wikipediaId = $derived(media.socialMedia?.wikipedia);

  const hasOfficialLinks = $derived(
    media.homepage || facebookId || xId || instagramId,
  );

  const hasOtherLinks = $derived(media.imdbId || media.tmdbId || wikipediaId);

  const hasLinks = $derived(hasOfficialLinks || hasOtherLinks);

  const commonProps = {
    source: "media-links",
    size: "large" as const,
  };
</script>

{#if hasLinks}
  <div class="trakt-media-links">
    {#if hasOfficialLinks}
      <div class="trakt-media-links-group">
        <span class="bold secondary">{m.header_official_links()}</span>
        <div class="trakt-media-links-list">
          {#if media.homepage}
            <ExternalLinkAction
              id={media.homepage}
              type="homepage"
              {...commonProps}
            />
          {/if}

          {#if facebookId}
            <ExternalLinkAction
              id={facebookId}
              type="facebook"
              {...commonProps}
            />
          {/if}

          {#if xId}
            <ExternalLinkAction id={xId} type="x" {...commonProps} />
          {/if}

          {#if instagramId}
            <ExternalLinkAction
              id={instagramId}
              type="instagram"
              {...commonProps}
            />
          {/if}
        </div>
      </div>
    {/if}

    {#if hasOtherLinks}
      <div class="trakt-media-links-group">
        <span class="bold secondary">{m.header_other_links()}</span>

        <div class="trakt-media-links-list">
          {#if media.imdbId}
            <ExternalLinkAction
              id={media.imdbId}
              type="imdb-media"
              {...commonProps}
            />
          {/if}

          {#if media.tmdbId}
            <ExternalLinkAction
              id={`${media.tmdbId}`}
              type="tmdb-media"
              mediaType={media.type}
              {...commonProps}
            />
          {/if}

          {#if wikipediaId}
            <ExternalLinkAction
              id={wikipediaId}
              type="wikipedia"
              {...commonProps}
            />
          {/if}
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  .trakt-media-links {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    padding: var(--ni-24) 0;

    border-top: var(--ni-1) solid var(--color-border);
    border-bottom: var(--ni-1) solid var(--color-border);
  }

  .trakt-media-links-group {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }

  .trakt-media-links-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
