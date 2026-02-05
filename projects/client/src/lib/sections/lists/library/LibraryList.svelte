<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import LibraryDropdown from "./_internal/LibraryDropdown.svelte";
  import LibraryMediaItem from "./_internal/LibraryMediaItem.svelte";
  import { LIBRARIES } from "./constants";
  import type { Library } from "./models/Library";
  import { useLibraryList } from "./useLibraryList";

  let activeLibrary: Library = $state("plex");

  const { list, isLoading } = $derived(
    useLibraryList({
      limit: DEFAULT_PAGE_SIZE,
      page: 1,
      library: activeLibrary,
    }),
  );

  // FIXME: when we have native plex sync, always show skeleton + cta/upsell to sync plex
</script>

<div class="trakt-library-list">
  <SectionList
    id="library-list"
    items={$list}
    title={m.list_title_library()}
    --height-list={mediaListHeightResolver("portrait")}
  >
    {#snippet item(item)}
      <LibraryMediaItem {item} />
    {/snippet}

    {#snippet actions()}
      <LibraryDropdown
        libraries={LIBRARIES}
        selectedLibrary={activeLibrary}
        onChange={(type) => (activeLibrary = type)}
      />

      <ViewAllButton
        href={UrlBuilder.library.me(activeLibrary)}
        label={m.button_label_view_all_library_items()}
        source={{ id: "library" }}
        disabled={$list.length === 0}
      />
    {/snippet}

    {#snippet empty()}
      {#if $isLoading}
        <SkeletonList id="library-list" variant="portrait" />
      {:else}
        {m.list_placeholder_personal_list_empty()}
      {/if}
    {/snippet}
  </SectionList>
</div>
