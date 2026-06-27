<script lang="ts">
  import { page } from "$app/state";
  import FilterScopeSetter from "$lib/features/filters/FilterScopeSetter.svelte";
  import type { FilterScope } from "$lib/features/filters/models/FilterScope.ts";
  import { getLanguageAndRegion } from "$lib/features/i18n";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { ExtendedMediaType } from "$lib/requests/models/ExtendedMediaType";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import Redirect from "../../components/router/Redirect.svelte";
  import Footer from "../footer/Footer.svelte";
  import NavbarStateSetter from "../navbar/NavbarStateSetter.svelte";
  import { openGraphUrlBuilder } from "./_internal/openGraphUrlBuilder";

  type MediaInfo = {
    overview: string;
    runtime?: number;
    year?: number | Nil;
    genres?: ReadonlyArray<string>;
    rating?: number | Nil;
    votes?: number;
    certification?: string | Nil;
    updatedAt?: Date | Nil;
  };

  type TraktPageProps = {
    title: string | undefined;
    type?: ExtendedMediaType | "webpage" | "home";
    image: string | Nil;
    info?: MediaInfo;
    hasDynamicContent?: boolean;
    mode?: "default" | "content-only";
    filterScope?: FilterScope;
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
    filterScope = "local",
  }: ChildrenProps & TraktPageProps & AudienceProps = $props();

  const websiteName = "Trakt Web";
  const websiteTitle = "Track Your Shows & Movies";
  const twitterHandle = "@trakt";
  const slug = $derived(page.params.slug);

  const DEFAULT_OVERVIEW =
    "Trakt Web: A new, lightweight way to track your favorite movies and TV shows.";
  const MAX_DESCRIPTION_LENGTH = 155;

  function truncateDescription(text: string): string {
    if (text.length <= MAX_DESCRIPTION_LENGTH) return text;
    const truncated = text.slice(0, MAX_DESCRIPTION_LENGTH);
    const lastSpace = truncated.lastIndexOf(" ");
    return `${truncated.slice(0, lastSpace > 0 ? lastSpace : MAX_DESCRIPTION_LENGTH)}…`;
  }

  const image = $derived.by(() => {
    const isMediaPage = type === "movie" || type === "show";
    if (isMediaPage && slug) {
      return openGraphUrlBuilder({
        url: page.url,
        type,
        slug,
      });
    }

    return _image ?? DEFAULT_SHARE_COVER;
  });

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
      case "episode":
        return "video.tv_show";
      case "webpage":
      default:
        return "website";
    }
  });

  const DEFAULT_PAGE_INFO: MediaInfo = {
    overview: DEFAULT_OVERVIEW,
    runtime: 0,
  };

  const info = $derived.by<MediaInfo | undefined>(() => {
    if (type !== "webpage" && type !== "home") return _info;
    return {
      ...DEFAULT_PAGE_INFO,
      overview: _info?.overview ?? DEFAULT_OVERVIEW,
    };
  });

  const fallbackDescription = "Trakt Web: Track Your Shows & Movies";

  const description = $derived(
    info?.overview ? truncateDescription(info.overview) : fallbackDescription,
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

  const isMediaPage = $derived(type === "movie" || type === "show");

  const createWebsiteLd = (url: string) => {
    const origin = new URL(url).origin;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: websiteName,
      url,
      description: websiteTitle,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${origin}${UrlBuilder.search()}?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    });
  };

  const buildAggregateRating = (
    rating: number | Nil,
    votes: number | undefined,
  ) => {
    if (!rating || !votes) return undefined;
    return {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      ratingCount: votes,
      bestRating: "10",
      worstRating: "0",
    };
  };

  const createMovieLd = (title: string, url: string) => {
    const { runtime, year, genres, rating, votes, certification } = _info ?? {};
    const genreLabels = genres?.map((g) => toTranslatedGenre(g)) ?? [];
    const aggregateRating = buildAggregateRating(rating, votes);

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Movie",
      name: title,
      description,
      image: _image,
      url,
      ...(year ? { datePublished: String(year) } : {}),
      ...(genreLabels.length > 0 ? { genre: genreLabels } : {}),
      ...(runtime && runtime > 0 ? { duration: `PT${runtime}M` } : {}),
      ...(certification ? { contentRating: certification } : {}),
      ...(aggregateRating ? { aggregateRating } : {}),
    });
  };

  const createShowLd = (title: string, url: string) => {
    const { year, genres, rating, votes } = _info ?? {};
    const genreLabels = genres?.map((g) => toTranslatedGenre(g)) ?? [];
    const aggregateRating = buildAggregateRating(rating, votes);

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TVSeries",
      name: title,
      description,
      image: _image,
      url,
      ...(year ? { datePublished: String(year) } : {}),
      ...(genreLabels.length > 0 ? { genre: genreLabels } : {}),
      ...(aggregateRating ? { aggregateRating } : {}),
    });
  };

  // FIXME: extend with season and episode information
  const createEpisodeLd = (title: string, url: string) =>
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "TVEpisode",
      name: title,
      description: description,
      image: _image,
      url,
    });

  const jsonLd = $derived.by(() => {
    if (type === "home") return createWebsiteLd(canonicalUrl);
    if (type === "movie" && _title) return createMovieLd(_title, canonicalUrl);
    if (type === "show" && _title) return createShowLd(_title, canonicalUrl);
    if (type === "episode" && _title)
      return createEpisodeLd(_title, canonicalUrl);
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
  {#if isMediaPage}
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  {/if}
  <meta property="og:title" content={ogTitle} />
  <meta property="og:locale" content={ogLocale} />

  {#if _info?.updatedAt}
    <meta property="og:updated_time" content={_info.updatedAt.toISOString()} />
  {/if}

  <meta name="description" content={description} />
  <meta property="og:description" content={description} />
  {#if _info?.runtime && _info.runtime > 0}
    <meta property="video:duration" content={`${_info.runtime * 60}`} />
  {/if}
  <meta name="twitter:description" content={description} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content={twitterHandle} />
  <meta name="twitter:title" content={ogTitle} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:creator" content={twitterHandle} />

  {#if jsonLd != null}
    {@html `<script type="application/ld+json">${jsonLd}</script>`}
  {/if}
</svelte:head>

<FilterScopeSetter {filterScope}>
  <RenderFor {audience}>
    {#if mode === "default"}
      <NavbarStateSetter mode="full" />
    {/if}

    <main class="trakt-content" data-mode={mode} {...dynamicContentProps}>
      {@render children()}
    </main>

    {#if mode === "default"}
      <Footer />
    {/if}
  </RenderFor>

  {#if audience === "authenticated"}
    <RenderFor audience="public">
      <Redirect to={UrlBuilder.home()} />
    </RenderFor>
  {/if}
</FilterScopeSetter>

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

    padding-inline-start: var(--layout-sidebar-distance);
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

    &[data-mode="content-only"] {
      padding-inline-start: 0;
      margin-top: 0;
      gap: 0;
    }
  }
</style>
