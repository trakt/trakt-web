<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";

  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardActionBar from "$lib/components/card/CardActionBar.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaCardProps } from "$lib/sections/lists/components/MediaCardProps";
  import CheckInAction from "$lib/sections/media-actions/check-in/CheckInAction.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import WatchlistAction from "$lib/sections/media-actions/watchlist/WatchlistAction.svelte";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { type, media }: Pick<MediaCardProps, "type" | "media"> = $props();

  /*
    FIXME:
    This should not be a separate component. Align concepts,
    terminology and props between EpisodeItem and DefaultMediaItem.
  */
</script>

{#snippet tag()}
  <AirDateTag i18n={TagIntlProvider} airDate={media.airDate} />
{/snippet}

<LandscapeCard>
  <RenderFor audience="authenticated">
    <CardActionBar>
      {#snippet actions()}
        <PopupMenu label={m.button_label_popup_menu({ title: media.title })}>
          {#snippet items()}
            <WatchlistAction
              style="dropdown-item"
              title={media.title}
              type={media.type}
              {media}
            />
            <MarkAsWatchedAction
              style="dropdown-item"
              title={media.title}
              type={media.type}
              {media}
            />
            {#if media.type === "movie"}
              <CheckInAction
                style="dropdown-item"
                title={media.title}
                type={media.type}
                {media}
              />
            {/if}
          {/snippet}
        </PopupMenu>
      {/snippet}
    </CardActionBar>
  </RenderFor>

  <Link focusable={false} href={UrlBuilder.media(type, media.slug)}>
    <CardCover
      title={media.title}
      src={media.cover.url.thumb}
      alt={m.image_alt_media_poster({ title: media.title })}
      --color-card-cover-shadow={media.colors?.[1]}
      {tag}
    />
  </Link>

  <CardFooter>
    <Link href={UrlBuilder.media(media.type, media.slug)}>
      <p class="trakt-card-title ellipsis">
        {media.title}
      </p>
    </Link>
    <p class="trakt-card-subtitle ellipsis small">
      {toTranslatedValue("type", media.type)}
    </p>
  </CardFooter>
</LandscapeCard>
