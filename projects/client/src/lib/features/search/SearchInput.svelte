<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import * as m from "$lib/features/i18n/messages";
  import { clickOutside } from "$lib/utils/actions/clickOutside";
  import { buildParamString } from "$lib/utils/url/buildParamString";
  import { onMount } from "svelte";
  import SearchIcon from "./SearchIcon.svelte";
  import { useSearch } from "./useSearch";

  const { isInline = true }: { isInline?: boolean } = $props();

  /** TODO: refactor system when we add support for people and such */
  const {
    clear: clearMovies,
    isSearching: isSearchingMovies,
    pathName,
    exitPathName,
    query,
  } = useSearch("movie");

  const { clear: clearShows, isSearching: isSearchingShows } =
    useSearch("show");

  function onSearch(ev: Event) {
    const inputElement = ev.target as HTMLInputElement;
    const value = inputElement.value.trim();

    if (value.length === 0) {
      if (!isInline) {
        goto(pathName, {
          replaceState: page.url.pathname === pathName,
          keepFocus: true,
        });
        return;
      }

      goto($exitPathName, {
        replaceState: true,
        keepFocus: true,
      });
      return;
    }

    goto(`${pathName}${buildParamString({ q: inputElement.value.trim() })}`, {
      replaceState: page.url.pathname === pathName,
      keepFocus: true,
    });
  }

  let inputElement: HTMLInputElement;

  function focusOnClick(node: HTMLElement) {
    const handler = () => {
      inputElement.focus();
    };

    node.addEventListener("click", handler);

    return {
      destroy() {
        node.removeEventListener("click", handler);
      },
    };
  }

  onMount(() => {
    if (isInline) {
      return;
    }

    const length = inputElement.value.length;
    inputElement.setSelectionRange(length, length);
    inputElement.focus();

    if (length > 0) {
      inputElement.click();
    }
  });
</script>

<div
  class="trakt-search"
  class:search-is-loading={$isSearchingMovies || $isSearchingShows}
  data-hj-suppress
>
  <div use:focusOnClick class="trakt-search-icon">
    <SearchIcon />
  </div>
  <input
    use:clickOutside
    bind:this={inputElement}
    onclick={onSearch}
    onclickoutside={() => {
      clearMovies();
      clearShows();
    }}
    class="trakt-search-input"
    type="search"
    defaultValue={$query}
    placeholder={m.input_placeholder_search()}
    oninput={onSearch}
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @keyframes slide-left-to-right {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  :global(.trakt-navbar-scroll:not(.trakt-navbar-pwa)) {
    .trakt-search {
      --mobile-search-focus-width: calc(
        100dvw - var(--layout-distance-side) * 2 - var(--navbar-side-padding) *
          2
      );

      .trakt-search-input {
        background: color-mix(
          in srgb,
          var(--color-background-navbar) 75%,
          transparent 25%
        );
        outline: var(--border-thickness-xs) solid var(--color-border);

        @include for-mobile {
          &:not(:focus-within) {
            opacity: 0;
          }
        }
      }
    }
  }

  .trakt-search {
    --search-input-width: clamp(var(--ni-80), 100%, var(--ni-480));
    --search-input-height: var(--ni-48);
    --mobile-search-focus-width: calc(100dvw - var(--layout-distance-side) * 2);
    --search-icon-size: var(--ni-24);
    --search-icon-offset: calc(var(--search-icon-size) / 2);

    display: flex;
    height: var(--search-input-height);
    width: var(--search-input-width);
    align-items: center;

    position: relative;

    @include for-mobile {
      --search-input-width: var(--ni-48);
    }

    .trakt-search-icon {
      cursor: pointer;

      position: absolute;
      z-index: calc(var(--layer-top) + var(--layer-overlay));
      top: var(--search-icon-offset);
      left: var(--search-icon-offset);
    }

    .trakt-search-input {
      all: unset;
      height: 100%;
      width: 100%;
      padding: var(--ni-8) var(--ni-16);
      padding-left: calc(
        var(--search-icon-size) + var(--search-icon-offset) + var(--ni-16)
      );
      box-sizing: border-box;

      border-radius: var(--border-radius-s);
      background: color-mix(
        in srgb,
        var(--color-background) 75%,
        transparent 25%
      );

      transition: var(--transition-increment) ease-in-out;
      transition-property:
        border-color, background-color, padding, width, top, left, opacity;

      @include backdrop-filter-blur(var(--ni-8));
      @include for-mobile {
        width: var(--search-icon-size);
        position: absolute;
        top: 0;
        left: 0;

        &:not(:focus-within) {
          padding: var(--ni-8) var(--ni-24);
          outline: none;
          opacity: 0.75;
        }
      }

      &:placeholder-shown {
        text-overflow: ellipsis;
      }

      &:focus-within {
        outline-color: var(--purple-600);
        opacity: 1;

        @include for-mobile {
          left: 0;
          top: 0;
          width: var(--mobile-search-focus-width);
          z-index: var(--layer-top);
        }
      }

      &::-webkit-search-cancel-button {
        -webkit-tap-highlight-color: transparent;
        -webkit-appearance: none;
        width: var(--ni-16);
        height: var(--ni-16);
        background-image: url("$lib/features/search/SearchClearIcon.svg");
        background-size: contain;
        cursor: pointer;
      }

      &::-moz-search-cancel-button {
        -moz-appearance: none;
        width: var(--ni-16);
        height: var(--ni-16);
        background-image: url("$lib/features/search/SearchClearIcon.svg");
        background-size: contain;
        cursor: pointer;
      }

      @include for-mobile {
        &:not(:focus-within) {
          &::-webkit-search-cancel-button {
            all: unset;
          }
          &::-moz-search-cancel-button {
            all: unset;
          }
        }
      }
    }

    &.search-is-loading {
      &::after {
        --search-side-distance: var(--ni-32);

        content: "";
        z-index: var(--layer-overlay);

        width: calc(var(--search-input-width) - var(--search-side-distance));
        height: var(--ni-2);

        position: absolute;
        bottom: var(--ni-neg-2);
        left: calc(var(--search-side-distance) / 2);
        right: 0;

        border-radius: 50%;
        background: linear-gradient(
          90deg,
          var(--color-foreground) 0%,
          var(--color-foreground) 50%,
          transparent 50%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: slide-left-to-right calc(var(--transition-increment) * 10)
          linear infinite;
      }

      @include for-mobile {
        &::after {
          z-index: calc(var(--layer-top) + var(--layer-overlay));
        }

        &:has(input:focus-within) {
          &::after {
            width: calc(
              var(--mobile-search-focus-width) - var(--search-side-distance)
            );
          }
        }
      }
    }
  }
</style>
