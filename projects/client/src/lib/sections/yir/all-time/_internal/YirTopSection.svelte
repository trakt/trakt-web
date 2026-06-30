<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import { languageTag } from "$lib/features/i18n";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { m } from "$lib/paraglide/messages";
  import type {
    YirGlobalTopItem,
    YirMostWatchedItem,
  } from "$lib/requests/models/YirDetail";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { fade } from "svelte/transition";
  import YirPageInner from "../../_internal/YirPageInner.svelte";
  import YirTopLogo from "./YirTopLogo.svelte";

  const {
    type,
    userItems,
    globalItems,
    firstYear,
    lastYear,
  }: {
    type: "shows" | "movies";
    userItems: YirMostWatchedItem[];
    globalItems: YirGlobalTopItem[];
    firstYear?: number;
    lastYear?: number;
  } = $props();

  // Full-bleed backdrop uses the user's most-watched title's cover (falls back
  // to the global #1 when the user has no plays of this type).
  const bgImage = $derived(
    userItems[0]?.entry.cover?.url?.medium ??
      globalItems[0]?.entry.cover?.url?.medium,
  );

  // Hovering a poster cross-fades the backdrop to that title's cover. The cover
  // persists after leaving so the fade-out animates from the last image rather
  // than blanking instantly.
  let isHoveringPoster = $state(false);
  let hoverCover = $state<string | undefined>(undefined);

  function onPosterEnter(item: YirMostWatchedItem) {
    hoverCover = item.entry.cover?.url?.medium ?? hoverCover;
    isHoveringPoster = true;
  }

  const yourTitle = $derived(
    type === "shows"
      ? m.yir_top_your_title_shows()
      : m.yir_top_your_title_movies(),
  );
  const cardTitle = $derived(
    type === "shows"
      ? m.yir_top_card_title_shows()
      : m.yir_top_card_title_movies(),
  );
  const description = $derived.by(() => {
    if (firstYear != null && lastYear != null) {
      return type === "shows"
        ? m.yir_top_card_description_shows({ start: firstYear, end: lastYear })
        : m.yir_top_card_description_movies({
            start: firstYear,
            end: lastYear,
          });
    }
    return m.yir_top_card_description({
      type: type === "shows" ? "shows" : "movies",
    });
  });

  function watchTime(minutes: number): string {
    return toHumanDuration({ minutes }, languageTag());
  }

  function plays(count: number): string {
    return m.yir_global_top_plays({
      count: toHumanNumber(count, languageTag()),
    });
  }
</script>

<section class="trakt-yir-top-section" id="section-{type}-top">
  {#if bgImage}
    <div class="yir-top-bg" style:background-image="url({bgImage})"></div>
    <!-- Re-keyed per cover so every hover cross-fades (in on the new cover,
         out on the old), not just the first one. -->
    {#if isHoveringPoster && hoverCover}
      {#key hoverCover}
        <div
          class="yir-top-bg"
          style:background-image="url({hoverCover})"
          transition:fade={{ duration: 600 }}
        ></div>
      {/key}
    {/if}
    <div class="yir-top-shade"></div>
  {/if}

  <YirPageInner>
    <div class="yir-top-layout">
      {#if userItems.length > 0}
        <div class="yir-top-user">
          <h2 class="bold yir-top-heading">{yourTitle}</h2>

          <ol
            class="yir-top-posters"
            role="list"
            onmouseleave={() => (isHoveringPoster = false)}
          >
            {#each userItems as item (item.entry.id)}
              <li onmouseenter={() => onPosterEnter(item)}>
                <Link
                  href={UrlBuilder.media(item.entry.type, item.entry.slug)}
                  color="inherit"
                >
                  <div class="yir-top-poster">
                    <CrossOriginImage
                      src={item.entry.poster?.url?.medium}
                      alt={item.entry.title}
                    />
                  </div>
                  <span class="uppercase yir-top-watch-time">
                    {watchTime(item.minutes)}
                  </span>
                </Link>
              </li>
            {/each}
          </ol>
        </div>
      {/if}

      {#if globalItems.length > 0}
        <aside class="yir-top-card">
          <header class="yir-top-card-header">
            <span class="yir-top-card-logo"><YirTopLogo /></span>
            <h3 class="bold yir-top-card-title">{cardTitle}</h3>
          </header>

          <p class="yir-top-card-desc">
            <MessageWithBold message={description} />
          </p>

          <ol class="yir-top-list" role="list">
            {#each globalItems as item, index (item.entry.id)}
              <li class:is-watched={item.watched}>
                <Link
                  href={UrlBuilder.media(item.entry.type, item.entry.slug)}
                  color="inherit"
                >
                  <span class="yir-top-rank">{index + 1}</span>
                  <span class="yir-top-title">{item.entry.title}</span>
                  <span class="uppercase yir-top-plays">
                    {plays(item.watchers)}
                  </span>
                </Link>
              </li>
            {/each}
          </ol>
        </aside>
      {/if}
    </div>
  </YirPageInner>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-top-section {
    position: relative;
    background-color: var(--color-yir-poster-background);
    padding: var(--ni-128) 0;
    overflow: hidden;

    @include for-mobile {
      padding: var(--ni-40) 0;
    }
  }

  .yir-top-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
  }

  // Light left-weighted gradient only — keeps the fanart vivid (like v2) while
  // giving the white title some footing. Text legibility over brighter fanart
  // is handled by text-shadow on the labels, not a heavy overall scrim.
  .yir-top-shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      color-mix(in srgb, var(--color-yir-poster-surface) 70%, transparent) 0%,
      color-mix(in srgb, var(--color-yir-poster-surface) 28%, transparent) 38%,
      transparent 68%
    );
  }

  .yir-top-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: var(--ni-72);
    align-items: center;

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr;
      gap: var(--ni-40);
    }

    @include for-mobile {
      // Match the charts' generous mobile side inset.
      padding-inline: 5%;
    }
  }

  .yir-top-heading {
    margin: 0 0 var(--ni-40);
    color: var(--color-yir-poster-foreground);
    font-size: clamp(var(--ni-32), 4vw, var(--ni-52));
    line-height: 1;
    text-shadow: 0 var(--ni-2) var(--ni-12)
      color-mix(in srgb, var(--color-yir-poster-surface) 75%, transparent);

    @include for-mobile {
      font-size: var(--ni-24);
      margin-bottom: var(--ni-20);
    }
  }

  .yir-top-posters {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: var(--ni-16) var(--ni-12);

    @include for-tablet-sm {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }

    @include for-mobile {
      // Flex-wrap centered so a partial last row (e.g. item 10 of 10) is
      // centered rather than hugging the start edge.
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      > li {
        flex: 0 0 calc((100% - 2 * var(--ni-12)) / 3);
      }
    }

    // While hovering the grid, fade non-hovered poster images down to their
    // black base (and dim the label) so the hovered one stands out.
    @include for-mouse {
      &:hover li:not(:hover) {
        .yir-top-poster :global(img) {
          opacity: 0.25;
        }

        .yir-top-watch-time {
          opacity: 0.5;
        }
      }
    }

    :global(.trakt-link) {
      display: flex;
      flex-direction: column;
      gap: var(--ni-4);
      text-decoration: none;
      color: var(--color-yir-poster-foreground);
    }
  }

  .yir-top-poster {
    width: 100%;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: var(--border-radius-m);
    // Black base so faded posters dim toward black, not the fanart behind.
    background-color: var(--color-yir-poster-surface);

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: opacity 0.6s ease;
    }
  }

  .yir-top-watch-time {
    font-size: var(--font-size-text);
    color: var(--color-yir-poster-foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 var(--ni-1) var(--ni-6)
      color-mix(in srgb, var(--color-yir-poster-surface) 85%, transparent);
    transition: opacity 0.6s ease;
  }

  // Floating dark Trakt card on the right.
  .yir-top-card {
    box-sizing: border-box;
    background-color: color-mix(in srgb, var(--color-yir-poster-surface) 92%, transparent);
    border-radius: var(--border-radius-xl);
    padding: var(--ni-24);
    // Clips the full-width rows to the card's rounded corners.
    overflow: hidden;

    @include for-tablet-sm-and-below {
      width: 100%;
    }
  }

  .yir-top-card-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-s);
    margin-bottom: var(--ni-16);
  }

  .yir-top-card-logo {
    display: inline-flex;
    flex-shrink: 0;
    width: var(--ni-44);
    height: var(--ni-44);
  }

  .yir-top-card-title {
    margin: 0;
    color: var(--color-yir-poster-foreground);
    font-size: var(--ni-44);
    font-weight: 800;
    line-height: 1;
  }

  .yir-top-card-desc {
    margin: 0 0 var(--ni-16);
    font-size: var(--font-size-text);
    color: var(--shade-200);
    text-align: center;

    :global(b) {
      color: var(--color-yir-poster-foreground);
    }
  }

  .yir-top-list {
    list-style: none;
    // Break out of the card's horizontal padding so the (purple) row fill
    // reaches the card edges.
    margin: 0 calc(-1 * var(--ni-24));
    padding: 0;
    display: flex;
    flex-direction: column;
    // 1px space between rows (no separator line) — keeps adjacent watched
    // (purple) rows visually distinct.
    gap: var(--ni-1);

    :global(.trakt-link) {
      display: grid;
      grid-template-columns: var(--ni-24) 1fr auto;
      align-items: center;
      gap: var(--gap-s);
      // Horizontal padding matches the card padding so content aligns with the
      // header while the background spans full width.
      padding: var(--ni-6) var(--ni-24);
      text-decoration: none;
      // The title inherits this row colour.
      color: var(--color-yir-poster-foreground);
    }

    // Watched rows get a full-width purple fill; the 1px gap separates
    // consecutive ones.
    li.is-watched :global(.trakt-link) {
      // Charts' "on" color — flat fill, no sheen.
      background-color: var(--viz-1);
      color: var(--color-yir-poster-foreground);
    }
  }

  // Fixed white circle (same size for 1-10). Text colour is set by the
  // higher-specificity rule below so it beats Link's inherited colour.
  .yir-top-rank {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--ni-24);
    height: var(--ni-24);
    box-sizing: border-box;
    border-radius: 50%;
    background-color: var(--color-yir-poster-foreground);
    font-weight: bold;
    font-size: var(--font-size-text);
  }

  .yir-top-title {
    font-size: var(--font-size-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .yir-top-plays {
    font-size: var(--font-size-text);
    white-space: nowrap;
  }

  // Scoped to `.trakt-link` (global at the start of the selector) so these
  // outrank the Link component's `.trakt-link span { color: inherit }` — the
  // rank stays black and the play count stays gray on every row, watched or
  // not.
  :global(.trakt-link) .yir-top-rank {
    color: var(--color-yir-poster-surface);
  }

  :global(.trakt-link) .yir-top-plays {
    color: var(--shade-400);
  }

  // Watched rows: brighten the play count to white. Scoped chain (no
  // `:global` in the middle) keeps it above the rule above.
  .yir-top-list li.is-watched .yir-top-plays {
    color: var(--color-yir-poster-foreground);
  }
</style>
