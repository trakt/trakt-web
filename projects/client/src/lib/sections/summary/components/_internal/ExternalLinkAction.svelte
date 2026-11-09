<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import FacebookIcon from "$lib/components/icons/FacebookIcon.svelte";
  import IMDBSquareIcon from "$lib/components/icons/IMDBSquareIcon.svelte";
  import InstagramIcon from "$lib/components/icons/InstagramIcon.svelte";
  import OfficialSiteIcon from "$lib/components/icons/OfficialSiteIcon.svelte";
  import TikTokIcon from "$lib/components/icons/TikTokIcon.svelte";
  import TMDBIcon from "$lib/components/icons/TMDBIcon.svelte";
  import WikidataIcon from "$lib/components/icons/WikidataIcon.svelte";
  import WikipediaIcon from "$lib/components/icons/WikipediaIcon.svelte";
  import XIcon from "$lib/components/icons/XIcon.svelte";
  import YouTubeIcon from "$lib/components/icons/YouTubeIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { m } from "$lib/features/i18n/messages.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  type SimpleLinkType =
    | "x"
    | "facebook"
    | "instagram"
    | "tiktok"
    | "youtube"
    | "wikidata"
    | "imdb-media"
    | "homepage";

  type ExternalLinkActionProps = {
    id: string;
    source: string;
    size?: "normal" | "large";
    style?: "action" | "dropdown-item";
  } & (
    | { type: SimpleLinkType }
    | { type: "wikipedia"; language?: string | Nil }
    | { type: "tmdb-media"; mediaType: MediaType }
  );

  const { id, source, size, style = "action", ...rest }: ExternalLinkActionProps = $props();

  const { track } = useTrack(AnalyticsEvent.Link);

  const href = $derived.by(() => {
    switch (rest.type) {
      case "x":
        return UrlBuilder.external.x(id);
      case "instagram":
        return UrlBuilder.external.instagram(id);
      case "facebook":
        return UrlBuilder.external.facebook(id);
      case "tiktok":
        return UrlBuilder.external.tiktok(id);
      case "youtube":
        return UrlBuilder.external.youtube(id);
      case "wikidata":
        return UrlBuilder.external.wikidata(id);
      case "wikipedia":
        return UrlBuilder.external.wikipedia(id, rest.language ?? undefined);
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

  const label = $derived.by(() => {
    switch (rest.type) {
      case "x":
        return "X";
      case "instagram":
        return "Instagram";
      case "facebook":
        return "Facebook";
      case "tiktok":
        return "TikTok";
      case "youtube":
        return "YouTube";
      case "wikidata":
        return "Wikidata";
      case "wikipedia":
        return "Wikipedia";
      case "imdb-media":
        return "IMDb";
      case "tmdb-media":
        return "TMDB";
      case "homepage":
        return m.button_label_official_website();
    }
  });
</script>

{#snippet icon()}
  {#if type === "x"}
    <XIcon />
  {/if}

  {#if type === "instagram"}
    <InstagramIcon />
  {/if}

  {#if type === "facebook"}
    <FacebookIcon />
  {/if}

  {#if type === "tiktok"}
    <TikTokIcon />
  {/if}

  {#if type === "youtube"}
    <YouTubeIcon />
  {/if}

  {#if type === "wikidata"}
    <WikidataIcon />
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
{/snippet}

{#if style === "action"}
  <ActionButton
    {href}
    {size}
    target="_blank"
    {label}
    style="ghost"
    onclick={() => track({ target: type, source })}
  >
    {@render icon()}
  </ActionButton>
{/if}

{#if style === "dropdown-item"}
  <DropdownItem
    {href}
    target="_blank"
    onclick={() => track({ target: type, source })}
    {icon}
  >
    {label}
  </DropdownItem>
{/if}
