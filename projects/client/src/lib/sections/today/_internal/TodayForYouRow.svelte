<script lang="ts">
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel.ts";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { TodayForYouItem } from "../models/TodayForYouItem.ts";
  import TodayForYouAction from "./TodayForYouAction.svelte";

  const { item }: { item: TodayForYouItem } = $props();

  const media = $derived(
    item.type === "up-next" ? item.entry.show : item.media,
  );
  const href = $derived(
    item.type === "up-next"
      ? UrlBuilder.episode(
          item.entry.show.slug,
          item.entry.season,
          item.entry.number,
        )
      : UrlBuilder.media(item.media.type, item.media.slug),
  );
</script>

<div class="trakt-today-for-you-row">
  <Link {href} label={media.title}>
    <div class="row-poster">
      <CrossOriginImage src={media.poster.url.thumb} alt="" />
    </div>
  </Link>

  <div class="row-info">
    <p class="tag uppercase bold row-kicker">
      {item.type === "up-next"
        ? m.tag_text_today_new_episode()
        : m.tag_text_today_released()}
    </p>
    <p class="bold ellipsis">{media.title}</p>
    {#if item.type === "up-next"}
      <p class="small secondary ellipsis">
        {episodeNumberLabel({ seasonNumber: item.entry.season, episodeNumber: item.entry.number })} · {item.entry.title}
      </p>
    {/if}
  </div>

  <TodayForYouAction {item} />
</div>

<style lang="scss">
  .trakt-today-for-you-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    padding: var(--gap-s);
    border: var(--border-thickness-xxs) solid var(--color-border);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);

    .row-poster {
      width: var(--ni-44);
      aspect-ratio: 2 / 3;

      :global(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--border-radius-s);
      }
    }

    .row-info {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);
      flex-grow: 1;
      min-width: 0;
    }

    .row-kicker {
      color: var(--color-text-emphasis);
    }
  }
</style>
