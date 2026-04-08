<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import FacebookIcon from "$lib/components/icons/FacebookIcon.svelte";
  import IMDBSquareIcon from "$lib/components/icons/IMDBSquareIcon.svelte";
  import InstagramIcon from "$lib/components/icons/InstagramIcon.svelte";
  import OfficialSiteIcon from "$lib/components/icons/OfficialSiteIcon.svelte";
  import TMDBIcon from "$lib/components/icons/TMDBIcon.svelte";
  import WikipediaIcon from "$lib/components/icons/WikipediaIcon.svelte";
  import XIcon from "$lib/components/icons/XIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type SimpleLinkType =
    | "x"
    | "facebook"
    | "instagram"
    | "wikipedia"
    | "imdb-media"
    | "homepage";

  type ExternalLinkActionProps = {
    id: string;
    source: string;
    size?: "normal" | "large";
  } & ({ type: SimpleLinkType } | { type: "tmdb-media"; mediaType: MediaType });

  const { id, source, size, ...rest }: ExternalLinkActionProps = $props();

  const { track } = useTrack(AnalyticsEvent.Link);

  const href = $derived.by(() => {
    switch (rest.type) {
      case "x":
        return UrlBuilder.external.x(id);
      case "instagram":
        return UrlBuilder.external.instagram(id);
      case "facebook":
        return UrlBuilder.external.facebook(id);
      case "wikipedia":
        return UrlBuilder.external.wikipedia(id);
      case "imdb-media":
        return UrlBuilder.external.imdb.media(id);
      case "tmdb-media":
        return UrlBuilder.external.tmdb.media(
          id,
          rest.mediaType === "show" ? "tv" : "movie",
        );
      case "homepage":
        return id;
    }
  });

  const type = $derived(rest.type);
</script>

<ActionButton
  {href}
  {size}
  target="_blank"
  label={type}
  style="ghost"
  onclick={() => track({ target: type, source })}
>
  {#if type === "x"}
    <XIcon />
  {/if}

  {#if type === "instagram"}
    <InstagramIcon />
  {/if}

  {#if type === "facebook"}
    <FacebookIcon />
  {/if}

  {#if type === "wikipedia"}
    <WikipediaIcon />
  {/if}

  {#if type === "imdb-media"}
    <IMDBSquareIcon />
  {/if}

  {#if type === "homepage"}
    <OfficialSiteIcon />
  {/if}

  {#if type === "tmdb-media"}
    <TMDBIcon />
  {/if}
</ActionButton>
