<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { ListCta, MediaCta } from "../models/Cta";

  const {
    intl,
    cta,
    size,
    icon,
  }: {
    intl: CtaItemIntl;
    cta: MediaCta | ListCta;
    size: "small" | "tag";
    icon?: Snippet;
  } = $props();

  const { track } = useTrack(AnalyticsEvent.Cta);

  const href = $derived.by(() => {
    switch (cta.type) {
      case "up-next":
      case "start-watching":
      case "personal-activity":
      case "upcoming":
        return UrlBuilder.shows();
      case "released":
        return UrlBuilder.trending({ type: "movie" });
      case "watchlist":
      case "favorites":
        return cta.mediaType === "show"
          ? UrlBuilder.shows()
          : UrlBuilder.movies();
      default:
        return undefined;
    }
  });

  const discoverHref = $derived.by(() => {
    switch (cta.type) {
      case "personal-list":
        return undefined;
      default:
        return UrlBuilder.discover();
    }
  });

  const buttonProps = $derived({
    color: size === "small" ? ("purple" as const) : ("default" as const),
    label: intl.cta.label({ cta }),
    disabled: cta.type === "personal-list" ? cta.action.disabled : false,
    onclick: () => {
      track({ type: cta.type });
      cta.type === "personal-list" && cta.action.onClick();
    },
  });
</script>

{#snippet content(buttonHref?: string)}
  <Button
    href={buttonHref}
    {size}
    {icon}
    variant="primary"
    style="flat"
    {...buttonProps}
  >
    {intl.cta.text({ cta })}
  </Button>
{/snippet}

<trakt-cta-button>
  <RenderForFeature flag={FeatureFlag.Discover}>
    {#snippet enabled()}
      {@render content(discoverHref)}
    {/snippet}

    {@render content(href)}
  </RenderForFeature>
</trakt-cta-button>

<style>
  trakt-cta-button {
    :global(.trakt-button) {
      flex-direction: row-reverse;
    }
  }
</style>
