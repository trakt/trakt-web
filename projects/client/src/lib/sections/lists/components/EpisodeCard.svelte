<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import {
    EPISODE_COVER_PLACEHOLDER,
    MEDIA_POSTER_PLACEHOLDER,
  } from "$lib/utils/constants";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { episodeSubtitle } from "$lib/utils/intl/episodeSubtitle";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { EpisodeCardProps } from "./models/EpisodeCardProps";

  const {
    popupActions: externalPopupActions,
    badge,
    action,
    tag,
    episode,
    media: show,
    source,
    ...rest
  }: EpisodeCardProps = $props();

  const isShowContext = $derived("context" in rest && rest.context === "show");

  const src = $derived(useEpisodeSpoilerImage({ episode, show }));

  const { track } = useTrack(AnalyticsEvent.SummaryDrilldown);
</script>

{#snippet popupActions()}
  {#if externalPopupActions}
    <CardActionBar>
      {#snippet actions()}
        <PopupMenu label={m.button_label_popup_menu({ title: episode.title })}>
          {#snippet items()}
            {@render externalPopupActions()}
          {/snippet}
        </PopupMenu>
      {/snippet}
    </CardActionBar>
  {/if}
{/snippet}

{#if rest.variant === "list-item"}
  <PortraitCard>
    {@render popupActions()}

    <Link
      focusable={false}
      href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
      onclick={() => source && track({ source, type: "episode" })}
    >
      <CardCover
        title={show.title}
        src={show.poster.url.thumb ?? MEDIA_POSTER_PLACEHOLDER}
        alt={`${show.title} - ${episode.title}`}
        {badge}
      />
    </Link>

    <CardFooter {tag} />
  </PortraitCard>
{:else}
  <LandscapeCard>
    {@render popupActions()}

    <Link
      focusable={false}
      href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
      onclick={() => source && track({ source, type: "episode" })}
    >
      <CardCover
        title={show.title}
        src={$src ?? EPISODE_COVER_PLACEHOLDER}
        alt={`${show.title} - ${episode.title}`}
        {badge}
        {tag}
      />
    </Link>

    <CardFooter {action}>
      {#if isShowContext}
        <p class="trakt-card-title ellipsis">
          <Spoiler media={episode} {show} type="episode">
            {episode.title}
          </Spoiler>
        </p>
        <p class="trakt-card-subtitle ellipsis">
          {episodeNumberLabel({
            seasonNumber: episode.season,
            episodeNumber: episode.number,
          })}
        </p>
      {/if}

      {#if !isShowContext}
        <Link href={UrlBuilder.show(show.slug)}>
          <p class="trakt-card-title ellipsis">
            {show.title}
          </p>
        </Link>
        <p class="trakt-card-subtitle ellipsis">
          {episodeSubtitle(episode)}
          {#if !["multiple_episodes", "full_season"].includes(episode.type)}
            <Spoiler media={episode} {show} type="episode">
              - {episode.title}
            </Spoiler>
          {/if}
        </p>
      {/if}
    </CardFooter>
  </LandscapeCard>
{/if}
