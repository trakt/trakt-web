<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import { genreIcons } from "$lib/components/icons/genres/genreIcons.ts";
  import PlusIcon from "$lib/components/icons/PlusIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toTranslatedGenre } from "$lib/utils/formatting/string/toTranslatedGenre.ts";
  import type { Genre } from "@trakt/api";
  import type { GenreCardProps } from "./GenreCardProps.ts";

  const {
    genre,
    isSelected = false,
    disabled = false,
    onclick,
  }: GenreCardProps = $props();
</script>

{#snippet content(genre: Genre)}
  <span class="genre-icon">{@html genreIcons[genre]}</span>
  <span class="genre-label">
    <span class="genre-name tag">{toTranslatedGenre(genre)}</span>
  </span>
  {#if isSelected}
    <span class="genre-check" aria-hidden="true">
      <CheckIcon />
    </span>
  {/if}
{/snippet}

{#if !genre}
  <div class="trakt-genre-card is-empty" aria-hidden="true">
    <PlusIcon />
  </div>
{:else if onclick}
  <button
    class="trakt-genre-card is-interactive"
    class:is-selected={isSelected}
    type="button"
    data-genre={genre}
    aria-pressed={isSelected}
    aria-label={m.button_label_toggle_genre({
      genre: toTranslatedGenre(genre),
    })}
    {disabled}
    {onclick}
  >
    {@render content(genre)}
  </button>
{:else}
  <div
    class="trakt-genre-card"
    class:is-selected={isSelected}
    data-genre={genre}
  >
    {@render content(genre)}
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-genre-card {
    --genre-card-foreground: color-mix(
      in srgb,
      var(--color-foreground) 70%,
      transparent
    );
    --stroke-0: var(--genre-card-foreground);

    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    aspect-ratio: 1;
    padding: min(var(--gap-xs), 8%);
    container-type: inline-size;
    box-sizing: border-box;
    border-radius: var(--border-radius-m);
    background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
    border: var(--border-thickness-xxs) solid
      color-mix(in srgb, var(--color-foreground) 5%, transparent);
    color: inherit;

    &.is-empty {
      background: transparent;
      border-style: dashed;
      border-color: color-mix(in srgb, var(--color-foreground) 20%, transparent);
      color: color-mix(in srgb, var(--color-foreground) 30%, transparent);

      :global(svg) {
        width: var(--ni-20);
        height: var(--ni-20);
      }
    }

    &.is-selected {
      --stroke-0: var(--color-foreground);
      border-color: var(--color-background-purple);
    }

    &.is-interactive {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition:
        border-color var(--transition-increment) ease-in-out,
        --genre-card-foreground var(--transition-increment) ease-in-out;

      &:disabled {
        --genre-card-foreground: var(--color-foreground-button-disabled);

        cursor: not-allowed;
      }

      @include for-mouse {
        &:hover:not(:disabled) {
          border-color: color-mix(
            in srgb,
            var(--color-background-purple) 60%,
            transparent
          );
        }
      }
    }
  }

  .genre-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: min(var(--ni-32), 32cqi);
    height: min(var(--ni-32), 32cqi);
    flex-shrink: 0;
  }

  .genre-label {
    display: block;
    width: 100%;
    margin-block-start: min(var(--gap-xs), 8cqi);
    font-size: var(--font-size-tag);
    line-height: 1.25;
    height: 1lh;
  }

  .genre-name {
    color: var(--genre-card-foreground);
    text-align: center;

    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;

    line-clamp: 2;
    -webkit-line-clamp: 2;

    @container (width < 48px) {
      line-clamp: 1;
      -webkit-line-clamp: 1;
    }
  }

  .genre-check {
    position: absolute;
    top: var(--ni-neg-6);
    inset-inline-end: var(--ni-neg-4);
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--ni-18);
    height: var(--ni-18);
    border-radius: 50%;
    background: var(--color-background-purple);
    color: var(--shade-10);

    :global(svg) {
      width: var(--ni-10);
      height: var(--ni-10);
    }

    :global(svg path) {
      stroke-width: 3;
    }
  }
</style>
