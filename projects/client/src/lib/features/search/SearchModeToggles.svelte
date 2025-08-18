<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import LoaderIcon from "$lib/components/icons/LoaderIcon.svelte";
  import PeopleIcon from "$lib/components/icons/PeopleIcon.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { useSearch } from "$lib/features/search/useSearch";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { buildParamString } from "$lib/utils/url/buildParamString";
  import SearchToggle from "./_internal/SearchToggle.svelte";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { pathName, mode, mediaType, targetParams } = useSearch();

  const toggleSearchMode = () => {
    const newMode = $mode === "media" ? "people" : "media";
    const type = newMode === "media" ? { t: $mediaType } : {};

    const params = buildParamString({ m: newMode, ...type, q: query });
    goto(`${pathName}${params}`, {
      replaceState: page.url.pathname === pathName,
      keepFocus: true,
    });
  };

  const setMediaType = (type: MediaType) => {
    if ($mode !== "media") {
      return;
    }

    const toggledType = type === "movie" ? "show" : "movie";
    const newType = $mediaType ? { t: undefined } : { t: toggledType };

    const params = buildParamString({
      ...$targetParams,
      ...newType,
      q: query,
    });

    goto(`${pathName}${params}`, {
      replaceState: page.url.pathname === pathName,
      keepFocus: true,
    });
  };
</script>

<div class="search-mode-toggles" role="group">
  <div class="search-mode-toggle-group">
    <SearchToggle
      label={m.button_label_toggle_search_media()}
      onclick={toggleSearchMode}
      isPressed={$mode === "media"}
    >
      {m.button_text_toggle_search_media()}
      {#snippet icon()}
        <LoaderIcon />
      {/snippet}
    </SearchToggle>
    <SearchToggle
      label={m.button_label_movies()}
      onclick={() => setMediaType("movie")}
      isPressed={$mediaType === "movie" || !$mediaType}
      disabled={$mode !== "media"}
      color="blue"
    >
      {m.button_text_movies()}
    </SearchToggle>
    <SearchToggle
      label={m.button_label_shows()}
      onclick={() => setMediaType("show")}
      isPressed={$mediaType === "show" || !$mediaType}
      disabled={$mode !== "media"}
      color="blue"
    >
      {m.button_text_shows()}
    </SearchToggle>
  </div>
  <div class="search-mode-toggle-group">
    <SearchToggle
      label={m.button_label_toggle_search_people()}
      onclick={toggleSearchMode}
      isPressed={$mode === "people"}
    >
      {m.button_text_toggle_search_people()}
      {#snippet icon()}
        <PeopleIcon />
      {/snippet}
    </SearchToggle>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .search-mode-toggles {
    display: flex;
    align-items: center;
    justify-content: center;

    margin-left: var(--layout-distance-side);
    margin-right: var(--layout-distance-side);

    gap: var(--gap-m);
    transition: gap var(--transition-increment) ease-in-out;

    @include for-mobile {
      gap: var(--gap-xs);
    }
  }

  .search-mode-toggle-group {
    display: flex;
    align-items: center;

    gap: var(--gap-xs);
    padding: var(--ni-4);

    border-radius: var(--border-radius-xl);

    background-color: transparent;
    transition: background-color var(--transition-increment) ease-in-out;

    &:global(:has(.trakt-button:not([disabled])[aria-pressed="true"])) {
      background-color: var(--color-card-background);
    }
  }
</style>
