<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaListSummary } from "$lib/requests/models/MediaListSummary.ts";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useListItems } from "$lib/sections/lists/components/list-summary/_internal/useListItems.ts";
  import MediaCard from "$lib/sections/lists/components/MediaCard.svelte";
  import { mediaListHeightResolver } from "$lib/sections/lists/utils/mediaListHeightResolver.ts";
  import ViewAllButton from "../ViewAllButton.svelte";
  import { getListUrl } from "./_internal/getListUrl";

  const { list, type }: { list: MediaListSummary; type: MediaType } = $props();

  const { items, isLoading } = useListItems({ list, type });
  const isEmptyList = $derived(!$isLoading && $items.length === 0);
</script>

<!-- FIXME switch to drillable list when support is added -->
<SectionList
  id={`top-list-${type}-${list.id}`}
  items={$items}
  title={list.name}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet actions()}
    <ViewAllButton
      href={getListUrl(list, type)}
      label={m.view_all()}
      isDisabled={isEmptyList}
    />
  {/snippet}
  {#snippet item(media)}
    <MediaCard {type} media={media.entry} />
  {/snippet}
</SectionList>
