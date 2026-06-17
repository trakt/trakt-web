<script lang="ts">
  import type { Genre } from "@trakt/api";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";

  type GenreCardProps = {
    genre: Genre;
    href: string;
  };

  const { genre, href }: GenreCardProps = $props();

  const label = $derived(toTranslatedGenre(genre));
  const isVisible = writable(false);
</script>

<div class="trakt-genre-card" use:whenInViewport={() => isVisible.set(true)}>
  {#if $isVisible}
    <a {href} class="trakt-link genre-link">
      <span class="genre-label">{label}</span>
    </a>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @mixin light-card {
    .trakt-genre-card {
      background-color: var(--shade-80);
      border-color: var(--shade-200);

      @include for-mouse {
        &:hover {
          box-shadow: inset 0 0 0 2px var(--shade-700);
        }
      }
    }
  }

  .trakt-genre-card {
    flex-shrink: 0;
    width: var(--width-genre-card, var(--width-portrait-card));
    height: var(--height-genre-card, calc(var(--width-portrait-card) / 1.5));
    border-radius: var(--border-radius-m);
    overflow: hidden;
    background-color: var(--shade-940);
    box-shadow: var(--shadow-base);
    border: 1px solid var(--shade-800);
    box-sizing: border-box;
    transition: box-shadow var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        box-shadow: inset 0 0 0 2px var(--shade-50);
      }
    }
  }

  :global([data-theme='light']) {
    @include light-card;
  }

  :global([data-theme='system']) {
    @media (prefers-color-scheme: light) {
      @include light-card;
    }
  }

  .genre-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }

  .genre-label {
    color: var(--color-text-primary);
    font-weight: bold;
    font-size: calc(var(--font-size-tag) * 1.5);
    text-align: center;
    letter-spacing: 0.05em;
    padding: var(--ni-8);
  }
</style>
