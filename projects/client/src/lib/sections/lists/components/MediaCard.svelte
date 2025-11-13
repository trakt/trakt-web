<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";

  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import IndicatorTags from "$lib/components/tags/IndicatorTags.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { languageTag } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toTranslatedType } from "$lib/utils/formatting/string/toTranslatedType";
  import { episodeSubtitle } from "$lib/utils/intl/episodeSubtitle";
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
    indicators,
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

    {#if indicators}
      <IndicatorTags>
        {@render indicators()}
      </IndicatorTags>
    {/if}
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

{#if variant === "activity" || variant === "next"}
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
        {#if variant === "activity"}
          {toTranslatedType(media.type)}
        {:else}
          {toHumanDuration({ minutes: media.runtime }, languageTag())}
        {/if}
      </p>
    </CardFooter>
  </LandscapeCard>
{/if}

{#if rest.variant === "start"}
  <PortraitCard>
    {@render content(media.poster.url.thumb)}
    <CardFooter {action}>
      <div class="trakt-card-start-footer">
        <p
          class="trakt-card-title small ellipsis"
          class:small={variant !== "activity"}
        >
          {media.title}
        </p>
        <p class="trakt-card-subtitle small ellipsis">
          {#if "episode" in rest}
            {episodeSubtitle(rest.episode)}
            <Spoiler media={rest.episode} show={media} type="episode">
              - {rest.episode.title}
            </Spoiler>
          {:else}
            {toHumanDuration({ minutes: media.runtime }, languageTag())}
          {/if}
        </p>
      </div>
    </CardFooter>
  </PortraitCard>
{/if}

<style>
  .trakt-card-start-footer {
    :global(.trakt-media-icon-tag),
    :global(.trakt-text-tag) {
      color: var(--color-text-secondary);
    }
  }
</style>
