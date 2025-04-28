<script lang="ts">
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import Link from "$lib/components/link/Link.svelte";

  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import CardCover from "$lib/components/card/CardCover.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import { getLocale } from "$lib/features/i18n";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanDate } from "$lib/utils/formatting/date/toHumanDate";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CardActionBar from "../../../components/card/CardActionBar.svelte";
  import type { MediaCardProps } from "./MediaCardProps";

  const {
    type,
    media,
    badge,
    tag,
    action,
    popupActions,
    ...rest
  }: MediaCardProps = $props();

  const variant = $derived(rest.variant ?? "portrait");
</script>

{#snippet content(mediaCoverImageUrl: string)}
  {#if popupActions}
    <CardActionBar>
      {#snippet actions()}
        <PopupMenu label={m.media_popup_label({ title: media.title })}>
          {#snippet items()}
            {@render popupActions()}
          {/snippet}
        </PopupMenu>
      {/snippet}
    </CardActionBar>
  {/if}

  <Link focusable={false} href={UrlBuilder.media(type, media.slug)}>
    <CardCover
      title={media.title}
      src={mediaCoverImageUrl}
      alt={m.media_poster({ title: media.title })}
      {badge}
    />
  </Link>

  <CardFooter {action} {tag}>
    {#if rest.variant === "activity"}
      <Link href={UrlBuilder.media(type, media.slug)}>
        <p
          class="trakt-card-title small ellipsis"
          class:small={rest.variant !== "activity"}
        >
          {media.title}
        </p>
      </Link>
      <p class="trakt-card-subtitle small ellipsis">
        {toHumanDate(new Date(), rest.date, getLocale())}
      </p>
    {/if}
  </CardFooter>
{/snippet}

{#if variant === "portrait"}
  <PortraitCard>
    {@render content(media.poster.url.thumb)}
  </PortraitCard>
{/if}

{#if variant === "landscape"}
  <LandscapeCard>
    {@render content(media.thumb.url)}
  </LandscapeCard>
{/if}

{#if variant === "activity"}
  <LandscapeCard>
    {@render content(media.thumb.url)}
  </LandscapeCard>
{/if}
