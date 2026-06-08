<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { YirTopRatedItem } from "$lib/requests/models/YirDetail.ts";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";

  type Yir2024RatedSectionProps = {
    type: "shows" | "movies";
    items: YirTopRatedItem[];
  };

  const { type, items }: Yir2024RatedSectionProps = $props();

  const heading = $derived(
    type === "shows"
      ? m.yir_2024_highest_rated_shows()
      : m.yir_2024_highest_rated_movies(),
  );

  let activeIndex = $state(0);
  const activeItem = $derived(items.at(activeIndex) ?? items.at(0));

  function itemUrl(item: YirTopRatedItem | undefined): string {
    if (!item) return "";
    return UrlBuilder.media(item.entry.type, item.entry.slug);
  }

  function rankLabel(rank: number): string {
    return rank.toString().padStart(2, "0");
  }
</script>

<section class="yir-2024-rated" id="section-{type}-highest-rated">
  <article class="yir-2024-rated-panel">
    <div class="yir-2024-rated-covers" aria-hidden="true">
      {#each items as item, index (item.entry.id)}
        <div class="yir-2024-rated-cover" class:current={index === activeIndex}>
          <CrossOriginImage src={item.entry.cover?.url?.medium} alt="" />
        </div>
      {/each}
    </div>
    <div class="yir-2024-rated-shade"></div>

    <div class="yir-2024-rated-grid">
      <div class="yir-2024-rated-main">
        <h2 class="bold yir-2024-rated-heading">{heading}</h2>

        <ol class="yir-2024-rated-list" role="list">
          {#each items as item, index (item.entry.id)}
            <li class="yir-2024-rated-row" role="listitem">
              <Link
                href={itemUrl(item)}
                color="inherit"
                onmouseenter={() => (activeIndex = index)}
                onfocus={() => (activeIndex = index)}
              >
                <span class="bold yir-2024-rated-rank" aria-hidden="true">
                  .{rankLabel(index + 1)}
                </span>
                <span class="yir-2024-rated-title">{item.entry.title}</span>
                <span class="yir-2024-rated-score">
                  <UserRating rating={item.rating} />
                </span>
              </Link>
            </li>
          {/each}
        </ol>
      </div>

      <!-- Redundant link for pointer users, No tab stop, no label, kept out of screen-reader order. -->
      <Link href={itemUrl(activeItem)} color="inherit" focusable={false}>
        <div class="yir-2024-rated-poster">
          {#each items as item, index (item.entry.id)}
            <div
              class="yir-2024-rated-poster-layer"
              class:current={index === activeIndex}
            >
              <CrossOriginImage src={item.entry.poster?.url?.medium} alt="" />
            </div>
          {/each}
        </div>
      </Link>
    </div>
  </article>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-2024-rated {
    width: 100%;
  }

  .yir-2024-rated-panel {
    position: relative;
    width: 100%;
    min-height: var(--ni-560);
    overflow: hidden;
    border-radius: var(--border-radius-xxl);
    color: var(--shade-10);

    @include for-mobile {
      min-height: 0;
      border-radius: var(--border-radius-xl);
    }
  }

  .yir-2024-rated-covers {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .yir-2024-rated-cover {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.5s ease;

    &.current {
      opacity: 1;
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .yir-2024-rated-shade {
    position: absolute;
    inset: 0;
    z-index: 1;
    background:
      linear-gradient(
        to right,
        color-mix(in srgb, var(--shade-1000) 85%, transparent) 0%,
        color-mix(in srgb, var(--shade-1000) 40%, transparent) 55%,
        transparent 100%
      ),
      linear-gradient(
        to top,
        color-mix(in srgb, var(--purple-700) 70%, var(--shade-1000)) 0%,
        color-mix(in srgb, var(--purple-700) 30%, transparent) 65%,
        color-mix(in srgb, var(--purple-700) 10%, transparent) 100%
      );
  }

  .yir-2024-rated-grid {
    position: relative;
    z-index: 2;
    height: 100%;
    box-sizing: border-box;
    padding: var(--ni-44) var(--ni-52);
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas: "main poster";
    column-gap: var(--ni-52);
    align-items: start;

    @include for-tablet-sm-and-below {
      padding: var(--ni-32);
      column-gap: var(--ni-32);
    }

    @include for-mobile {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: "main";
      padding: var(--ni-20);
    }
  }

  .yir-2024-rated-main {
    grid-area: main;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ni-32);

    @include for-mobile {
      gap: var(--ni-20);
    }
  }

  .yir-2024-rated-heading {
    margin: 0;
    font-size: clamp(var(--ni-28), 3.5vw, var(--ni-44));

    @include for-mobile {
      font-size: var(--ni-24);
    }
  }

  .yir-2024-rated-list {
    list-style: none;
    margin: 0;
    padding: 0;

    &:hover .yir-2024-rated-row:not(:hover) {
      opacity: 0.5;
    }
  }

  .yir-2024-rated-row {
    transition: opacity 0.25s var(--transition-increment) ease-out;

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--ni-20);
      padding-block: var(--ni-10);
      border-bottom: 1px solid
        color-mix(in srgb, var(--shade-10) 22%, transparent);
      text-decoration: none;
      color: inherit;

      @include for-mobile {
        gap: var(--ni-12);
        padding-block: var(--ni-8);
      }
    }

    &:last-child :global(.trakt-link) {
      border-bottom: none;
    }
  }

  .yir-2024-rated-rank {
    flex: none;
    width: var(--ni-32);
    font-size: clamp(var(--ni-14), 1.2vw, var(--ni-18));
    color: var(--shade-300);

    @include for-mobile {
      width: var(--ni-24);
      font-size: var(--font-size-tag);
    }
  }

  .yir-2024-rated-title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: clamp(var(--ni-14), 1.2vw, var(--ni-18));

    @include for-mobile {
      font-size: var(--font-size-tag);
    }
  }

  .yir-2024-rated-score {
    flex: none;
    display: inline-flex;
    align-items: center;
    color: var(--shade-300);
    font-size: clamp(var(--ni-14), 1.2vw, var(--ni-18));

    @include for-mobile {
      font-size: var(--font-size-tag);
    }
  }

  :global(.yir-2024-rated-grid > .trakt-link) {
    grid-area: poster;
    align-self: start;
    justify-self: end;
    display: block;
    text-decoration: none;

    @include for-mobile {
      display: none;
    }
  }

  .yir-2024-rated-poster {
    position: relative;
    width: var(--ni-300);
    aspect-ratio: 2 / 3;
    overflow: hidden;
    // Matches the summary-page poster corner (SummaryPoster.svelte).
    border-radius: var(--border-radius-xxl);
    box-shadow: 0 var(--ni-16) var(--ni-48)
      color-mix(in srgb, var(--shade-1000) 50%, transparent);
    transition: transform 0.25s var(--transition-increment) ease-out;

    &:hover {
      transform: scale(1.03);
    }

    @include for-tablet-sm-and-below {
      width: var(--ni-220);
    }
  }

  .yir-2024-rated-poster-layer {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.5s ease;

    &.current {
      opacity: 1;
    }

    :global(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
</style>
