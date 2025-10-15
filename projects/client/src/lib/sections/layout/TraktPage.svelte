<script lang="ts">
  import { page } from "$app/state";
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import Redirect from "../../components/router/Redirect.svelte";

  type TraktPageProps = {
    title: string | undefined;
    type?: MediaType | "webpage" | "home";
    image: string | Nil;
    info?: {
      overview: string;
      runtime: number;
    };
    hasDynamicContent?: boolean;
  };

  const {
    children,
    audience,
    type = "webpage",
    title: _title,
    image: _image,
    info: _info,
    hasDynamicContent = false,
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
  <meta property="og:site_name" content={websiteName} />
  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={page.url.toString()} />
  <meta property="og:image" content={image} />
  <meta property="og:title" content={ogTitle} />
  <meta property="og:locale" content="en_US" />
  <meta property="og:updated_time" content={new Date().toISOString()} />

  {#if info != null}
    <meta name="description" content={info.overview} />
    <meta property="og:description" content={info.overview} />
    {#if info.runtime > 0}
      <meta property="video:duration" content={`${info.runtime * 60}`} />
    {/if}
    <meta name="twitter:description" content={info.overview} />
  {/if}

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content={twitterHandle} />
  <meta name="twitter:title" content={ogTitle} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:creator" content={twitterHandle} />
</svelte:head>

<RenderFor {audience}>
  <div class="trakt-content" {...dynamicContentProps}>
    {@render children()}
  </div>

  <style lang="scss">
    @use "$style/scss/mixins/index" as *;

    .trakt-content {
      --content-gap: var(--gap-xl);

      transition: var(--transition-increment) ease-in-out;
      transition-property: gap, margin;

      display: flex;
      flex-direction: column;
      gap: var(--content-gap);

      &:first-child {
        margin-top: calc(var(--gap-m) + env(safe-area-inset-top));

        @include for-tablet-sm-and-below {
          margin-top: var(--content-gap);
        }
      }

      @include for-tablet-lg-and-below {
        --content-gap: var(--gap-l);
      }

      @include for-mobile {
        --content-gap: var(--gap-m);

        &:first-child {
          margin-top: 0;
        }
      }
    }
  </style>
</RenderFor>

{#if audience === "authenticated"}
  <RenderFor audience="public">
    <Redirect to={UrlBuilder.home()} />
  </RenderFor>
{/if}
