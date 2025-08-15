<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import * as m from "$lib/features/i18n/messages";
  import { useSearch } from "$lib/features/search/useSearch";
  import ToggleTag from "$lib/sections/components/ToggleTag.svelte";
  import { buildParamString } from "$lib/utils/url/buildParamString";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { pathName, mode } = useSearch();

  const toggleSearchMode = () => {
    const newMode = $mode === "media" ? "people" : "media";

    const params = buildParamString({ m: newMode, q: query });
    goto(`${pathName}${params}`, {
      replaceState: page.url.pathname === pathName,
      keepFocus: true,
    });
  };
</script>

<div class="search-mode-toggles" role="group">
  <ToggleTag
    label={m.button_label_toggle_search_media()}
    onclick={toggleSearchMode}
    isPressed={$mode === "media"}
  >
    {m.button_text_toggle_search_media()}
  </ToggleTag>
  <ToggleTag
    label={m.button_label_toggle_search_people()}
    onclick={toggleSearchMode}
    isPressed={$mode === "people"}
  >
    {m.button_text_toggle_search_people()}
  </ToggleTag>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .search-mode-toggles {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    margin-left: var(--layout-distance-side);
    margin-right: var(--layout-distance-side);

    gap: var(--gap-xs);

    @include for-tablet-sm-and-below {
      justify-content: center;
    }
  }
</style>
