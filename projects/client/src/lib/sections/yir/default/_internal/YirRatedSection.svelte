<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { m } from "$lib/paraglide/messages";
  import type { YirTopRatedItem } from "$lib/requests/models/YirDetail";
  import UserRating from "$lib/sections/components/UserRating.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YirPageInner from "./YirPageInner.svelte";
  import YirSectionHeader from "./YirSectionHeader.svelte";

  const {
    type,
    items,
  }: {
    type: "shows" | "movies";
    items: YirTopRatedItem[];
  } = $props();

  const sectionTitle = $derived(
    type === "shows"
      ? m.yir_section_title_highest_rated_shows()
      : m.yir_section_title_highest_rated_movies(),
  );

  let activeIndex = $state(0);

  function itemUrl(item: YirTopRatedItem): string {
    return UrlBuilder.media(
      type === "shows" ? "show" : "movie",
      item.entry.slug,
    );
  }
</script>

<section class="trakt-yir-rated-section" id="section-{type}-ratings">
  {#each items as item, index (item.entry.id)}
    <div
      class="yir-fanart-bg"
      class:current={index === activeIndex}
      style:background-image="url({item.entry.cover?.url?.medium ?? ''})"
    ></div>
  {/each}

  <div class="yir-rated-inner">
    <YirSectionHeader>
      {sectionTitle}
    </YirSectionHeader>

    <YirPageInner>
      <div class="yir-posters">
        {#each items as item, index (item.entry.id)}
          <div class="yir-grid-item" title={item.entry.title}>
            <Link
              href={itemUrl(item)}
              label={item.entry.title}
              onmouseenter={() => {
                activeIndex = index;
              }}
            >
              <div class="yir-poster">
                <img
                  class="yir-poster-img"
                  src={item.entry.poster?.url?.thumb}
                  alt={item.entry.title}
                />
              </div>
              <div class="yir-rating">
                <UserRating rating={item.rating} />
              </div>
            </Link>
          </div>
        {/each}
      </div>
    </YirPageInner>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-rated-section {
    text-align: center;
    position: relative;
    background-color: var(--shade-950);
  }

  .yir-fanart-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0;
    transition: all 0.5s;

    &.current {
      opacity: 1;
    }
  }

  .yir-rated-inner {
    position: relative;
    z-index: 1;
    background-color: color-mix(in srgb, var(--shade-1000) 30%, transparent);
    padding-bottom: var(--ni-72);

    @include for-mobile {
      padding-bottom: var(--ni-40);
    }
  }

  .yir-posters {
    text-align: center;

    &:hover .yir-grid-item:not(:hover) {
      .yir-poster-img,
      .yir-rating {
        opacity: 0.3;
      }
    }
  }

  .yir-grid-item {
    width: 10%;
    display: inline-block;
    padding: 0;
    margin: 0;

    :global(.trakt-link) {
      display: block;
      text-decoration: none;
    }

    @include for-mobile {
      width: 20%;
    }
  }

  .yir-poster {
    border: none;
    background-color: var(--shade-1000);
    box-shadow: 0 0 var(--ni-20) var(--shade-1000);
    position: relative;

    .yir-poster-img {
      transition: all 0.5s;
    }
  }

  .yir-poster-img {
    width: 100%;
    display: block;
    aspect-ratio: 2 / 3;
    object-fit: cover;
  }

  // 5-point star rating (shared v3 UserRating), centered beneath the poster.
  .yir-rating {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--ni-8);
    color: var(--shade-10);
    transition: all 0.5s;
  }
</style>
