<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import Link from "$lib/components/link/Link.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import { EpisodeComputedType } from "$lib/requests/models/EpisodeType";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { episodeActivityTitle } from "$lib/utils/intl/episodeActivityTitle";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";
  import { episodeSubtitle } from "$lib/utils/intl/episodeSubtitle";
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

  const isShowContext = $derived("context" in rest && rest.context === "show");
  const isActivity = $derived(rest.variant === "activity");

  const src = useEpisodeSpoilerImage({ episode, show });
</script>

<LandscapeCard>
  {#if popupActions}
    <CardActionBar>
      {#snippet actions()}
        <PopupMenu label={m.button_label_popup_menu({ title: episode.title })}>
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
      <p class="trakt-card-subtitle ellipsis small">
        {episodeNumberLabel({
          seasonNumber: episode.season,
          episodeNumber: episode.number,
        })}
      </p>
    {/if}

    {#if rest.variant === "activity"}
      <Link href={UrlBuilder.show(show.slug)}>
        <p class="trakt-card-title ellipsis">
          {episodeActivityTitle(episode, show)}
        </p>
      </Link>
      <p class="trakt-card-subtitle ellipsis small">
        {EpisodeIntlProvider.timestampText({
          type: episode.type,
          date: rest.date,
        })}
      </p>
    {/if}

    {#if !isShowContext && !isActivity}
      <Link href={UrlBuilder.show(show.slug)}>
        <p
          class="trakt-card-title ellipsis"
          class:uppercase={episode.type === EpisodeComputedType.full_season}
        >
          {show.title}
        </p>
      </Link>
      <p class="trakt-card-subtitle ellipsis small">
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
