<script lang="ts">
  import { page } from "$app/state";
  import { getLanguageAndRegion } from "$lib/features/i18n";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import Redirect from "../../components/router/Redirect.svelte";
  import Footer from "../footer/Footer.svelte";
  import NavbarStateSetter from "../navbar/NavbarStateSetter.svelte";

  type TraktPageProps = {
    title: string | undefined;
    type?: MediaType | "webpage" | "home";
    image: string | Nil;
    info?: {
      overview: string;
      runtime?: number;
    };
    hasDynamicContent?: boolean;
    mode?: "default" | "content-only";
  };

  const {
    children,
    audience,
    type = "webpage",
    title: _title,
    image: _image,
    info: _info,
    hasDynamicContent = false,
    mode = "default",
  }: ChildrenProps & TraktPageProps & AudienceProps = $props();

  const websiteName = "Trakt Web";
  const websiteTitle = "Track Your Shows & Movies";
  const twitterHandle = "@trakt";

  const image = $derived(_image ?? DEFAULT_SHARE_COVER);
  const displayTitle = $derived(`${websiteName}: ${_title || websiteTitle}`);
  const defaultOgTitle = `${websiteName}: ${websiteTitle}`;

  const ogTitle = $derived.by(() => {
    switch (type) {
      case "home":
        return defaultOgTitle;
      case "webpage":
        return displayTitle;
      default:
        return _title || defaultOgTitle;
    }
  });

  const ogType = $derived.by(() => {
    switch (type) {
      case "movie":
        return "video.movie";
      case "show":
        return "video.tv_show";
      case "webpage":
      default:
        return "website";
    }
  });

  const info = $derived(
    type === "webpage" || type === "home"
      ? {
          overview:
            "Trakt Web: A new, lightweight way to track your favorite movies and TV shows.",
          runtime: 0,
        }
      : _info,
  );

  const canonicalUrl = $derived(`${page.url.origin}${page.url.pathname}`);

  const ogLocale = $derived.by(() => {
    const { language, region } = getLanguageAndRegion();
    return `${language}_${region.toUpperCase()}`;
  });

  const AUDIENCE_ROBOTS: Record<AudienceProps["audience"], string> = {
    all: "index, follow",
    public: "index, follow",
    free: "noindex, nofollow",
    vip: "noindex, nofollow",
    authenticated: "noindex, nofollow",
    director: "noindex, nofollow",
  };

  const robots = $derived(AUDIENCE_ROBOTS[audience]);

  const createWebsiteLd = (url: string) =>
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: websiteName,
      url,
      description: websiteTitle,
    });

  const createMovieLd = (title: string, url: string) => {
    const duration = _info?.runtime;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Movie",
      name: title,
      description: _info?.overview,
      image: _image,
      url,
      ...(duration && duration > 0 ? { duration: `PT${duration}M` } : {}),
    });
  };

  const createShowLd = (title: string, url: string) =>
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TVSeries",
      name: title,
      description: _info?.overview,
      image: _image,
      url,
    });

  const jsonLd = $derived.by(() => {
    if (type === "home") return createWebsiteLd(canonicalUrl);
    if (type === "movie" && _title) return createMovieLd(_title, canonicalUrl);
    if (type === "show" && _title) return createShowLd(_title, canonicalUrl);
    return null;
  });

  const dynamicContentProps = $derived(
    hasDynamicContent
      ? {
          "data-dynamic-selector": `[data-dpad-navigation="${DpadNavigationType.List}"]`,
        }
      : {},
  );
</script>

<svelte:head>
  <title>{displayTitle}</title>
  <link rel="canonical" href={canonicalUrl} />
  <meta name="robots" content={robots} />
  <meta property="og:site_name" content={websiteName} />
  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:image" content={image} />
  <meta property="og:image:alt" content={ogTitle} />
  <meta property="og:title" content={ogTitle} />
  <meta property="og:locale" content={ogLocale} />
  <meta property="og:updated_time" content={new Date().toISOString()} />

  {#if info != null}
    <meta name="description" content={info.overview} />
    <meta property="og:description" content={info.overview} />
    {#if info.runtime && info.runtime > 0}
      <meta property="video:duration" content={`${info.runtime * 60}`} />
    {/if}
    <meta name="twitter:description" content={info.overview} />
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content={twitterHandle} />
  <meta name="twitter:title" content={ogTitle} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:creator" content={twitterHandle} />

  {#if jsonLd != null}
    {@html `<script type="application/ld+json">${jsonLd}</script>`}
  {/if}
</svelte:head>

<RenderFor {audience}>
  {#if mode === "default"}
    <NavbarStateSetter mode="full" />
  {/if}

  <div class="trakt-content" {...dynamicContentProps}>
    {@render children()}
  </div>

  {#if mode === "default"}
    <Footer />
  {/if}
</RenderFor>

{#if audience === "authenticated"}
  <RenderFor audience="public">
    <Redirect to={UrlBuilder.home()} />
  </RenderFor>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-content {
    --content-gap: var(--gap-m);

    transition: var(--transition-increment) ease-in-out;
    transition-property: gap, margin, padding;

    display: flex;
    flex-direction: column;
    gap: var(--content-gap);

    min-height: 100vh;

    padding-left: var(--layout-sidebar-distance);
    margin-top: calc(var(--gap-m) + env(safe-area-inset-top));

    @include for-tablet-sm-and-below {
      margin-top: var(--content-gap);
    }

    @include for-tablet-lg-and-below {
      --content-gap: var(--gap-l);
    }

    @include for-mobile {
      margin-top: var(--gap-xxs);
      --content-gap: var(--gap-s);
    }
  }
</style>
