<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";

  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CardActionBar from "../../../components/card/CardActionBar.svelte";
  import type { MediaCardProps } from "./MediaCardProps";

  const {
    type,
    media,
    badge,
    tag,
    coverTag,
    action,
    popupActions,
    source,
    ...rest
  }: MediaCardProps = $props();

  const { track } = useTrack(AnalyticsEvent.SummaryDrilldown);

  const defaultVariant = $derived(useDefaultCardVariant(type));
  const variant = $derived(rest.variant ?? $defaultVariant);
</script>

{#snippet content(mediaCoverImageUrl: string, mediaCoverOverlay?: string)}
  {#if popupActions}
    <CardActionBar>
      {#snippet actions()}
        <PopupMenu label={m.button_label_popup_menu({ title: media.title })}>
          {#snippet items()}
            {@render popupActions()}
          {/snippet}
        </PopupMenu>
      {/snippet}
    </CardActionBar>
  {/if}

  <Link
    focusable={false}
    href={UrlBuilder.media(type, media.slug)}
    onclick={() => {
      rest.onclick?.(media);
      source && track({ source, type: media.type });
    }}
  >
    <CardCover
      title={media.title}
      src={mediaCoverImageUrl}
      overlaySrc={mediaCoverOverlay}
      alt={m.image_alt_media_poster({ title: media.title })}
      --color-card-cover-shadow={media.colors?.[1]}
      {badge}
      tag={coverTag}
    />
  </Link>
{/snippet}

{#if variant === "portrait"}
  <PortraitCard>
    {@render content(media.poster.url.thumb)}
    <CardFooter {action} {tag} />
  </PortraitCard>
{/if}

{#if variant === "landscape"}
  <LandscapeCard>
    {@render content(media.cover.url.thumb, media.logo.url.medium)}
    <CardFooter {action} {tag} />
  </LandscapeCard>
{/if}

{#if rest.variant === "activity"}
  <LandscapeCard>
    {@render content(media.thumb.url)}
    <CardFooter {action} {tag}>
      <Link href={UrlBuilder.media(type, media.slug)}>
        <p
          class="trakt-card-title small ellipsis"
          class:small={variant !== "activity"}
        >
          {media.title}
        </p>
      </Link>
      <p class="trakt-card-subtitle small ellipsis">
        {toTranslatedValue("type", media.type)}
      </p>
    </CardFooter>
  </LandscapeCard>
{/if}
