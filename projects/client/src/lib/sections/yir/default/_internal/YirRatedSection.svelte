<script lang="ts">
  import type { YirTopRatedItem } from "$lib/requests/models/YirDetail";
  import { m } from "$lib/paraglide/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import YirSectionHeader from "./YirSectionHeader.svelte";
  import YirPageInner from "./YirPageInner.svelte";

  const {
    type,
    items,
  }: {
    type: "shows" | "movies";
    items: YirTopRatedItem[];
  } = $props();

  const sectionTitle = $derived(
    type === "shows" ? m.yir_section_title_highest_rated_shows() : m.yir_section_title_highest_rated_movies(),
  );

  let activeIndex = $state(0);

  function itemUrl(item: YirTopRatedItem): string {
    return UrlBuilder.media(type === "shows" ? "show" : "movie", item.entry.slug);
  }
</script>

<section class="yir-rated-section" id="section-{type}-ratings">
  {#each items as item, index}
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
        {#each items as item, index}
          <a
            href={itemUrl(item)}
            class="yir-grid-item"
            title={item.entry.title}
            onmouseenter={() => { activeIndex = index; }}
          >
            <div class="yir-poster">
              <div class="yir-corner-rating">
                <span>{item.rating}</span>
              </div>
              <img
                class="yir-poster-img"
                src={item.entry.poster.url.thumb}
                alt={item.entry.title}
              />
            </div>
          </a>
        {/each}
      </div>
    </YirPageInner>
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .yir-rated-section {
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
      .yir-corner-rating {
        opacity: 0.3;
      }
    }
  }

  .yir-grid-item {
    width: 10%;
    display: inline-block;
    padding: 0;
    margin: 0;
    text-decoration: none;

    @include for-mobile {
      width: 20%;
    }
  }

  .yir-poster {
    border: none;
    background-color: var(--shade-1000);
    box-shadow: 0 0 var(--ni-20) var(--shade-1000);
    position: relative;

    .yir-poster-img,
    .yir-corner-rating {
      transition: all 0.5s;
    }
  }

  .yir-corner-rating {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 var(--ni-40) var(--ni-40) 0;
    border-color: transparent var(--red-500) transparent transparent;
    font-size: 10px;
    font-weight: bold;
    color: var(--shade-10);

    span {
      position: absolute;
      top: var(--ni-4);
      right: var(--ni-neg-36);
      width: var(--ni-30);
      text-align: center;
    }
  }

  .yir-poster-img {
    width: 100%;
    display: block;
    aspect-ratio: 2 / 3;
    object-fit: cover;
  }
</style>
