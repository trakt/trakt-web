<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import Card from "$lib/components/card/Card.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import Spoiler from "$lib/features/spoilers/components/Spoiler.svelte";
  import { useEpisodeSpoilerImage } from "$lib/features/spoilers/useEpisodeSpoilerImage";
  import { EPISODE_COVER_PLACEHOLDER } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { EpisodeCardProps } from "./EpisodeCardProps";

  const {
    popupActions,
    badges,
    action,
    tags,
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

<Card
  --width-card="var(--width-episode-card)"
  --height-card="var(--height-episode-card)"
  --height-card-cover="var(--height-episode-card-cover)"
>
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
      src={$src ?? EPISODE_COVER_PLACEHOLDER}
      alt={`${show.title} - ${episode.title}`}
      {badges}
      {tags}
    />
  </Link>

  <CardFooter {action}>
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
      <Link href={UrlBuilder.show(show.slug)}>
        <p class="trakt-card-title ellipsis">{show.title}</p>
      </Link>
      <p class="trakt-card-subtitle ellipsis small">
        {episode.season}x{episode.number}
        <Spoiler media={episode} {show} {episode} type="episode">
          - {episode.title}
        </Spoiler>
      </p>
    {/if}
  </CardFooter>
</Card>
