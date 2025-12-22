<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import SkeletonList from "$lib/components/lists/SkeletonList.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import * as m from "$lib/features/i18n/messages.ts";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { slide } from "svelte/transition";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import LibraryDropdown from "./_internal/LibraryDropdown.svelte";
  import LibraryMediaItem from "./_internal/LibraryMediaItem.svelte";
  import { useLibraryList } from "./useLibraryList";

  const { list, libraries, activeLibrary, isLoading } = $derived(
    useLibraryList({ limit: DEFAULT_PAGE_SIZE }),
  );

  const { plexLibrary } = useUser();

  const hasLibraryItems = $derived(
    $plexLibrary &&
      ($plexLibrary.movieIds.length > 0 || $plexLibrary.episodeIds.length > 0),
  );
</script>

{#if hasLibraryItems}
  <div class="trakt-library-list" transition:slide={{ duration: 150 }}>
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
        {#if $libraries.length > 1}
          <LibraryDropdown
            libraries={$libraries}
            selectedLibrary={$activeLibrary}
            onChange={(type) => activeLibrary.next(type)}
          />
        {/if}

        <ViewAllButton
          href={UrlBuilder.library.me($activeLibrary)}
          label={m.button_label_view_all_library_items()}
          source={{ id: "library" }}
        />
      {/snippet}

      {#snippet empty()}
        {#if $isLoading}
          <SkeletonList id="library-list" variant="portrait" />
        {/if}
      {/snippet}
    </SectionList>
  </div>
{/if}
