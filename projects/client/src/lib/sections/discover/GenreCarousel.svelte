<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import GenreCard from "$lib/components/card/GenreCard.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { GENRES } from "$lib/features/filters/_internal/genres.ts";
</script>

<section class="trakt-genre-carousel">
  <div class="section-header">
    <a href="/discover/genre/action" class="trakt-link section-title-link">
      <span class="section-title">{m.section_title_browse_by_genre()}</span>
      <CaretRightIcon />
    </a>
  </div>

  <div class="genre-track">
    {#each GENRES as genre (genre)}
      <GenreCard {genre} href="/discover/genre/{genre}" />
    {/each}
  </div>
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-genre-carousel {
    --width-genre-card: var(--width-portrait-card);
    --height-genre-card: calc(var(--width-portrait-card) / 1.5);

    display: flex;
    flex-direction: column;
    gap: var(--list-header-gap);
  }

  .section-header {
    margin: 0 var(--layout-distance-side);
    height: var(--ni-40);
    display: flex;
    align-items: center;
  }

  .section-title-link {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    text-decoration: none;
    color: var(--color-text-primary);

    :global(svg) {
      flex-shrink: 0;
      width: calc(var(--font-size-title) * 0.9);
      height: calc(var(--font-size-title) * 0.9);
    }

    @include for-mouse {
      &:hover {
        color: var(--color-link-active);
      }
    }
  }

  .section-title {
    font-size: var(--font-size-title);
    font-weight: bold;
    line-height: var(--ni-22);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .genre-track {
    display: flex;
    gap: var(--list-gap);
    overflow-x: hidden;
    mask-image: linear-gradient(
      to right,
      black calc(100% - var(--layout-distance-side)),
      transparent calc(100% - var(--layout-distance-side))
    );
    scrollbar-width: none;
    padding: 0 var(--layout-distance-side);
    padding-bottom: var(--ni-4);

    &::-webkit-scrollbar {
      display: none;
    }

    @supports (-moz-appearance: none) {
      overflow-x: auto;
      mask-image: none;
    }

    @include for-tablet-sm-and-below {
      overflow-x: auto;
      mask-image: none;
    }
  }
</style>
