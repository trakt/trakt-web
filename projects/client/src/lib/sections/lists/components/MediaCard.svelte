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
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toTranslatedType } from "$lib/utils/formatting/string/toTranslatedType";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CardActionBar from "../../../components/card/CardActionBar.svelte";
  import type { MediaCardProps } from "./models/MediaCardProps";

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

{#if variant === "progress"}
  <PortraitCard>
    {@render content(media.poster.url.thumb)}
    <CardFooter {action} {tag}>
      <Link href={UrlBuilder.media(type, media.slug)}>
        <p class="trakt-card-title ellipsis">
          {media.title}
        </p>
      </Link>
    </CardFooter>
  </PortraitCard>
{/if}

{#if variant === "activity" || variant === "next"}
  <LandscapeCard>
    {@render content(media.thumb.url)}
    <CardFooter {action} {tag}>
      <Link href={UrlBuilder.media(type, media.slug)}>
        <p
          class="trakt-card-title ellipsis"
          class:small={variant !== "activity"}
        >
          {media.title}
        </p>
      </Link>
      <p class="trakt-card-subtitle ellipsis">
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
        <p class="trakt-card-title ellipsis">
          {media.title}
        </p>
        <p class="trakt-card-subtitle ellipsis">
          {#if "episode" in rest}
            {episodeNumberLabel({
              seasonNumber: rest.episode.season,
              episodeNumber: rest.episode.number,
            })}
          {:else}
            {toHumanDuration({ minutes: media.runtime }, languageTag())}
          {/if}
        </p>
      </div>
    </CardFooter>
  </PortraitCard>
{/if}

{#if rest.variant === "credit"}
  <PortraitCard>
    {@render content(media.poster.url.thumb)}
    <CardFooter {action}>
      <div class="trakt-card-credit-footer">
        <p class="trakt-card-title ellipsis">
          {rest.role}
        </p>
        {#if tag}
          <div class="trakt-card-subtitle">
            {@render tag()}
          </div>
        {/if}
      </div>
    </CardFooter>
  </PortraitCard>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-card-start-footer {
    :global(.trakt-media-icon-tag),
    :global(.trakt-text-tag) {
      color: var(--color-text-secondary);
    }
  }

  .trakt-card-credit-footer .trakt-card-subtitle {
    :global(p),
    :global(.trakt-text-tag),
    :global(.trakt-media-icon-tag) {
      color: var(--color-text-secondary);
      font-size: var(--font-size-text-small);
    }
  }
</style>
