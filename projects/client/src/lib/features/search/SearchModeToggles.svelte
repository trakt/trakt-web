<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { ToggleOption } from "$lib/components/toggles/ToggleOption";
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useSearch } from "$lib/features/search/useSearch";
  import type { SearchMode } from "$lib/requests/queries/search/models/SearchMode";
  import { assertDefined } from "$lib/utils/assert/assertDefined";
  import { buildParamString } from "$lib/utils/url/buildParamString";
  import { writable } from "svelte/store";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { pathName, mode } = useSearch();

  const selectedType = writable<SearchMode>($mode);

  const onChange = (value: SearchMode) => {
    selectedType.set(value);

    const newMode = assertDefined(value);
    const params = buildParamString({ m: newMode, q: query });

    goto(`${pathName}${params}`, {
      replaceState: page.url.pathname === pathName,
      keepFocus: true,
    });
  };

  const options: ToggleOption<SearchMode>[] = [
    {
      value: "media",
      text: m.button_text_toggle_search_media,
      label: m.button_label_toggle_search_media,
    },
    {
      value: "show",
      text: m.button_text_shows,
      label: m.button_label_shows,
    },
    {
      value: "movie",
      text: m.button_text_movies,
      label: m.button_label_movies,
    },
    {
      value: "people",
      text: m.button_text_toggle_search_people,
      label: m.button_label_toggle_search_people,
    },
  ];
</script>

<div class="search-mode-toggles" role="group">
  <Toggler value={$selectedType} variant="text" {onChange} {options} />
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

    @include for-tablet-sm-and-below {
      gap: var(--gap-xs);
      margin: 0;
    }
  }
</style>
