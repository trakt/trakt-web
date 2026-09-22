<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages.ts";
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { toTranslatedLibrary } from "$lib/utils/formatting/string/toTranslatedLibrary";
  import { useLibrarySelection } from "./useLibrarySelection.ts";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import LibraryMediaItem from "./_internal/LibraryMediaItem.svelte";
  import LibraryEmptyState from "./_internal/LibraryEmptyState.svelte";
  import LibraryToggler from "./_internal/LibraryToggler.svelte";
  import type { Library } from "./models/Library";
  import { useLibraryList } from "./useLibraryList";

  const { mode }: { mode: DiscoverMode } = $props();

  const librarySelection = useLibrarySelection();
  const { selection } = librarySelection;
  const activeLibrary: Library = $derived($selection.value);

  const { list, isLoading } = $derived(
    useLibraryList({
      limit: DEFAULT_PAGE_SIZE,
      page: 1,
      library: activeLibrary,
      type: mode,
    }),
  );
</script>

{#snippet metaInfo()}
  <ListMetaInfo text={toTranslatedLibrary(activeLibrary)} />
{/snippet}

<div class="trakt-library-list">
  <SectionList
    id={{
      scope: "library-list",
      key: `${mode}-${activeLibrary}`,
    }}
    items={$list}
    title={m.list_title_library()}
    {metaInfo}
    --height-list={mediaListHeightResolver("portrait")}
    drilldown={{
      href: UrlBuilder.library.me(activeLibrary),
      label: m.button_label_view_all_library_items(),
      source: { id: "library" },
    }}
  >
    {#snippet item(item)}
      <LibraryMediaItem {item} />
    {/snippet}

    {#snippet actions()}
      <LibraryToggler library={librarySelection} />
    {/snippet}

    {#snippet empty()}
      {#if $isLoading}
        <SkeletonList id="library-list" variant="portrait" />
      {:else}
        <LibraryEmptyState library={activeLibrary} />
      {/if}
    {/snippet}
  </SectionList>
</div>
