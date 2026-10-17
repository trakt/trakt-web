<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import SearchIcon from "$lib/components/icons/SearchIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { clickOutside } from "$lib/utils/actions/clickOutside";
  import { buildParamString } from "$lib/utils/url/buildParamString";
  import { onDestroy, onMount } from "svelte";
  import { useSearch } from "./useSearch";

  type SearchInputProps = {
    variant?: "default" | "embedded";
  };

  const { variant = "default" }: SearchInputProps = $props();

  const { clear, isSearching, pathName, mode, query } = useSearch();

  const isMouse = useMedia(WellKnownMediaQuery.mouse);

  const navigationDebounce = 120;
  let pendingNavigation: ReturnType<typeof setTimeout> | undefined;

  const isOnSearchPage = () => page.url.pathname === pathName;

  function navigate() {
    const params = buildParamString({
      m: $mode,
      q: inputElement.value.trim(),
    });
    const onSearchPage = isOnSearchPage();

    goto(`${pathName}${params}`, {
      replaceState: onSearchPage,
      keepFocus: true,
      noScroll: onSearchPage,
    });
  }

  function onSearch() {
    clearTimeout(pendingNavigation);

    if (!isOnSearchPage()) {
      navigate();
      return;
    }

    pendingNavigation = setTimeout(() => {
      if (!isOnSearchPage()) return;
      navigate();
    }, navigationDebounce);
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

  const placeholder = $derived.by(() => {
    switch ($mode) {
      case "media":
        return m.input_placeholder_search();
      case "movie":
        return m.input_placeholder_search_movies();
      case "show":
        return m.input_placeholder_search_shows();
      case "people":
        return m.input_placeholder_search_people();
      case "lists":
        return m.input_placeholder_search_lists();
    }
  });

  onDestroy(() => clearTimeout(pendingNavigation));

  onMount(() => {
    if (!$isMouse) {
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
  class:search-is-loading={$isSearching}
  data-variant={variant}
  data-hj-suppress
  data-sentry-mask
>
  <div use:focusOnClick class="trakt-search-icon">
    <SearchIcon />
  </div>
  <input
    use:clickOutside
    bind:this={inputElement}
    onclick={onSearch}
    onclickoutside={clear}
    class="trakt-search-input"
    type="search"
    defaultValue={$query}
    {placeholder}
    oninput={onSearch}
  />
  {#if $isSearching}
    <div class="trakt-search-loader"></div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  @keyframes slide-left-to-right {
    to {
      transform: translateX(calc(200% / 3));
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

    transition: outline var(--transition-increment) ease-in-out;
    outline: var(--border-thickness-xxs) solid var(--color-border);

    &,
    .trakt-search-input {
      border-radius: var(--border-radius-l);
    }

    &:focus-within {
      outline: var(--border-thickness-xs) solid var(--color-input-focus);
    }

    &[data-variant="embedded"] {
      --search-input-width: 100%;
      --search-input-height: var(--ni-32);
      --search-icon-size: var(--ni-18);

      outline: none;

      &:focus-within {
        outline: none;

        .trakt-search-icon {
          color: var(--color-input-focus);
        }

        @media (forced-colors: active) {
          outline: var(--border-thickness-xxs) solid Highlight;
        }
      }

      &,
      .trakt-search-input {
        border-radius: var(--border-radius-s);
      }

      .trakt-search-input {
        background: transparent;
        backdrop-filter: none;
      }

      .trakt-search-icon :global(svg) {
        display: block;
        width: var(--search-icon-size);
        height: var(--search-icon-size);
      }

      &.search-is-loading .trakt-search-loader {
        bottom: calc(-1 * var(--ni-4));
        height: var(--ni-1);
      }
    }

    .trakt-search-icon {
      cursor: pointer;

      position: absolute;
      z-index: calc(var(--layer-top) + var(--layer-overlay));
      top: calc((var(--search-input-height) - var(--search-icon-size)) / 2);
      inset-inline-start: var(--search-icon-offset);
    }

    .trakt-search-input {
      all: unset;
      height: 100%;
      width: 100%;
      padding: var(--ni-8) var(--ni-16);
      padding-inline-start: calc(
        var(--search-icon-size) + var(--search-icon-offset) + var(--ni-16)
      );
      box-sizing: border-box;

      border-radius: var(--border-radius-l);
      background: var(--color-input-background);

      transition: var(--transition-increment) ease-in-out;
      transition-property:
        border-color, background-color, padding, width, top, inset-inline-start,
        opacity;

      backdrop-filter: var(--backdrop-filter-input-search);

      &:placeholder-shown {
        text-overflow: ellipsis;
      }

      &:focus-within {
        opacity: 1;
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
      .trakt-search-loader {
        --search-side-distance: var(--ni-32);

        z-index: var(--layer-overlay);

        width: calc(var(--search-input-width) - var(--search-side-distance));
        height: var(--ni-2);

        position: absolute;
        bottom: var(--ni-neg-2);
        inset-inline-start: calc(var(--search-side-distance) / 2);
        inset-inline-end: 0;

        border-radius: 50%;
        overflow: hidden;

        &::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: -200%;
          width: 300%;

          background: linear-gradient(
            90deg,
            var(--color-foreground) 0%,
            var(--color-foreground) 33.3333%,
            transparent 33.3333%,
            transparent 66.6667%,
            var(--color-foreground) 66.6667%,
            var(--color-foreground) 100%
          );
          animation: slide-left-to-right calc(var(--transition-increment) * 5)
            linear infinite;
        }
      }

      @include for-mobile {
        .trakt-search-loader {
          z-index: calc(var(--layer-top) + var(--layer-overlay));
        }

        &:has(input:focus-within) {
          .trakt-search-loader {
            width: calc(
              var(--mobile-search-focus-width) - var(--search-side-distance)
            );
          }
        }
      }
    }
  }
</style>
