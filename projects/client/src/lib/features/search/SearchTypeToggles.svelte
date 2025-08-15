<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import * as m from "$lib/features/i18n/messages";
  import { useSearch } from "$lib/features/search/useSearch";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import ToggleTag from "$lib/sections/components/ToggleTag.svelte";
  import { buildParamString } from "$lib/utils/url/buildParamString";

  const query = $derived(page.url.searchParams.get("q")?.trim());

  const { pathName, mode, mediaType, targetParams } = useSearch();

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

<div class="media-type-toggles" role="group">
  <ToggleTag
    label={m.button_label_movies()}
    onclick={() => setMediaType("movie")}
    isPressed={$mediaType === "movie" || !$mediaType}
  >
    {m.button_text_movies()}
  </ToggleTag>
  <ToggleTag
    label={m.button_label_shows()}
    onclick={() => setMediaType("show")}
    isPressed={$mediaType === "show" || !$mediaType}
  >
    {m.button_text_shows()}
  </ToggleTag>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .media-type-toggles {
    display: flex;
    justify-content: center;
    gap: var(--gap-xxs);

    /* To visually align the buttons better with the header */
    padding-top: var(--ni-2);
  }
</style>
