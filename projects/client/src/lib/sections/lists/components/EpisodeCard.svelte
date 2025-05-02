<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import Link from "$lib/components/link/Link.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import * as m from "$lib/features/i18n/messages.ts";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import { EpisodeComputedType } from "$lib/requests/models/EpisodeType";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { EpisodeCardProps } from "./EpisodeCardProps";

  const {
    popupActions,
    badge,
    action,
    tag,
    episode,
    show,
    ...rest
  }: EpisodeCardProps = $props();

  const src = $derived(useEpisodeSpoilerImage({ episode, show }));

  const isShowContext = $derived(
    rest.variant === "default" && rest.context === "show",
  );
  const isActivity = $derived(rest.variant === "activity");
</script>

{#snippet upcomingTag()}
  <AirDateTag
    i18n={TagIntlProvider}
    airDate={episode.airDate}
    year={episode.year}
  />
{/snippet}

{#snippet durationTag()}
  <DurationTag i18n={TagIntlProvider} runtime={episode.runtime} />
{/snippet}

<LandscapeCard>
  {#if popupActions}
    <CardActionBar>
      {#snippet actions()}
        <PopupMenu label={m.media_popup_label({ title: episode.title })}>
          {#snippet items()}
            {@render popupActions()}
          {/snippet}
        </PopupMenu>
      {/snippet}
    </CardActionBar>
  {/if}

  <Link
    focusable={false}
    href={UrlBuilder.episode(show.slug, episode.season, episode.number)}
  >
    <CardCover
      title={episode.title}
      src={$src ?? EPISODE_COVER_PLACEHOLDER}
      alt={`${show.title} - ${episode.title}`}
      {badge}
      {tag}
    />
  </Link>

  <CardFooter
    {action}
    tag={(() => {
      if (isActivity) {
        return;
      }

      if (rest.variant === "upcoming") {
        return upcomingTag;
      }

      return durationTag;
    })()}
  >
    {#if isShowContext}
      <p class="trakt-card-title ellipsis">
        <Spoiler media={episode} {show} {episode} type="episode">
          {episode.title}
        </Spoiler>
      </p>
      <p class="trakt-card-subtitle ellipsis small">
        {episode.season}x{episode.number}
      </p>
    {/if}

    {#if rest.variant === "activity"}
      <Link href={UrlBuilder.show(show.slug)}>
        <p class="trakt-card-title ellipsis">
          {episode.season}x{episode.number} - {show.title}
        </p>
      </Link>
      <p class="trakt-card-subtitle ellipsis small">
        {EpisodeIntlProvider.timestampText(rest.date)}
      </p>
    {/if}

    {#if !isShowContext && !isActivity}
      {#if episode.type === EpisodeComputedType.full_season}
        <Link href={UrlBuilder.show(show.slug)}>
          <p class="trakt-card-title uppercase ellipsis">
            {m.season_number_label({
              number: episode.season.toString().padStart(2, "0"),
            })}
          </p>
        </Link>
      {:else}
        <Link href={UrlBuilder.show(show.slug)}>
          <p class="trakt-card-title ellipsis">{show.title}</p>
        </Link>
      {/if}
      <p class="trakt-card-subtitle ellipsis small">
        {episode.season}x{episode.number}
        <Spoiler media={episode} {show} {episode} type="episode">
          - {episode.title}
        </Spoiler>
      </p>
    {/if}
  </CardFooter>
</LandscapeCard>
