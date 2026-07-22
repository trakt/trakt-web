<script lang="ts">
  import ListIcon from "$lib/components/icons/mobile/ListIcon.svelte";
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import PeopleIcon from "$lib/components/icons/PeopleIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import type { SelectOption } from "$lib/components/select/models/SelectOption.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { SearchMode } from "$lib/requests/queries/search/models/SearchMode";
  import SearchInput from "./SearchInput.svelte";
  import { useSearchMode } from "./useSearchMode";

  // The small-screen counterpart of the NavbarContentToggle's search surface:
  // one self-contained panel with the five mode segments (selected-label form
  // for width) and the embedded search field.
  const { mode, setMode } = useSearchMode();

  const label: Record<SearchMode, () => string> = {
    media: m.button_text_toggle_search_media,
    show: m.button_text_shows,
    movie: m.button_text_movies,
    people: m.button_text_toggle_search_people,
    lists: m.button_text_toggle_search_lists,
  };

  const options = $derived(
    (["media", "show", "movie", "people", "lists"] as const).map((value) => ({
      value,
      label: label[value](),
    })),
  );
</script>

<div class="trakt-search-mode-panel" role="search">
  <SegmentedSelect
    variant="selected-label"
    expandable
    expanded
    {options}
    value={$mode}
    ariaLabel={m.page_title_search()}
    icon={modeIcon}
    extension={searchExtension}
    onChange={(value) => setMode(value as SearchMode)}
  />
</div>

{#snippet modeIcon(option: SelectOption)}
  {#if option.value === "media"}<MediaIcon />{/if}
  {#if option.value === "show"}<ShowIcon />{/if}
  {#if option.value === "movie"}<MovieIcon />{/if}
  {#if option.value === "people"}<PeopleIcon />{/if}
  {#if option.value === "lists"}<ListIcon />{/if}
{/snippet}

{#snippet searchExtension()}
  <SearchInput variant="embedded" />
{/snippet}

<style lang="scss">
  .trakt-search-mode-panel {
    display: flex;
    width: 100%;

    :global(.trakt-segmented-select) {
      width: 100%;
      // No own blur here: the panel mounts inside the mobile bar's FADING
      // contextual area, and a backdrop-filter under an opacity-animating
      // ancestor re-composites when the fade ends - it reads as the whole
      // panel swapping colours after load. The bar is frosted already.
      backdrop-filter: none;
    }
  }
</style>
