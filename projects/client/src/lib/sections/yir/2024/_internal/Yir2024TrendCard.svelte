<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { m } from "$lib/paraglide/messages";
  import type { YirTrendItem } from "$lib/requests/models/YirDetail.ts";
  import { formatNumber } from "$lib/utils/format/formatNumber.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  type Yir2024TrendCardProps = {
    item: YirTrendItem;
  };

  const { item }: Yir2024TrendCardProps = $props();

  const itemUrl = $derived(UrlBuilder.media(item.entry.type, item.entry.slug));

  // Localized month name derived from the 1-12 index (year-agnostic).
  const monthLabel = $derived(
    new Intl.DateTimeFormat(languageTag(), { month: "long" }).format(
      new Date(2024, item.month - 1, 1),
    ),
  );

  const watchersLabel = $derived(
    m.yir_2024_trend_watchers({ count: formatNumber(item.watchers) }),
  );
</script>

<div class="yir-2024-trend-card">
  <Link href={itemUrl} color="inherit">
    <span class="uppercase yir-2024-trend-month">{monthLabel}</span>

    <div class="yir-2024-trend-poster">
      <CrossOriginImage
        src={item.entry.poster?.url?.medium}
        alt={item.entry.title}
      />
    </div>

    <span class="yir-2024-trend-title">{item.entry.title}</span>
    <span class="uppercase yir-2024-trend-watchers">{watchersLabel}</span>

    {#if item.watched}
      <span class="yir-2024-trend-watched">
        <CheckIcon />
        <span class="bold uppercase">{m.yir_2024_trend_watched()}</span>
      </span>
    {/if}
  </Link>
</div>

<style>
  /* The whole card is one Link laid out as a column; strip the link's
     underline and inherit the card's white text. */
  .yir-2024-trend-card :global(.trakt-link) {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    text-decoration: none;
    color: var(--shade-10);
  }

  .yir-2024-trend-month {
    font-size: var(--font-size-text);
    color: var(--shade-300);
    letter-spacing: 1px;
    /* A little breathing room above the poster. */
    margin-bottom: var(--ni-4);
  }

  .yir-2024-trend-poster {
    width: 100%;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: var(--border-radius-m);
    background-color: var(--shade-900);

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .yir-2024-trend-title {
    font-size: var(--font-size-title);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-top: var(--ni-4);
  }

  .yir-2024-trend-watchers {
    font-size: var(--font-size-tag);
    color: var(--shade-300);
    letter-spacing: 1px;
  }

  /* Purple "✓ Watched" pill, sitting below the watcher count (matches v2). */
  .yir-2024-trend-watched {
    align-self: flex-start;
    margin-top: var(--ni-4);
    display: inline-flex;
    align-items: center;
    gap: var(--ni-4);
    padding: var(--ni-4) var(--ni-12);
    border-radius: var(--border-radius-xl);
    background-color: var(--purple-500);
    color: var(--shade-10);
    font-size: var(--font-size-tag);
    white-space: nowrap;

    :global(svg) {
      width: var(--ni-12);
      height: var(--ni-12);
    }
  }
</style>
