<script lang="ts" generics="T extends { key: string; type: MediaType }">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { FilterParams } from "$lib/requests/models/FilterParams";
  import type { SearchParams } from "$lib/requests/models/SearchParams";
  import type { Observable } from "rxjs";
  import type { Snippet } from "svelte";
  import DrilledMediaList from "../drilldown/DrilledMediaList.svelte";
  import type { DiscoverListName } from "./DiscoverListName";
  import type { DiscoverPaginatedListProps } from "./DiscoverPaginatedListProps";

  type Props = DiscoverPaginatedListProps & {
    name: DiscoverListName;
    useList: (
      params: { type: DiscoverMode; limit: number } & FilterParams &
        SearchParams,
    ) => {
      list: Observable<T[]>;
      isLoading: Observable<boolean>;
      fetchNextPage: () => Promise<void>;
      hasNextPage: Observable<boolean>;
    };
    listItem: Snippet<[T, "mixed" | "standalone"]>;
  };

  const { title, type, actions, search, name, useList, listItem }: Props =
    $props();
  const { filterMap } = useFilter();
</script>

<DrilledMediaList
  id="view-all-{name}-{type}"
  {title}
  {type}
  filter={$filterMap}
  useList={(params) =>
    useList({
      ...params,
      search,
    })}
  {actions}
>
  {#snippet item(media)}
    {@render listItem(media, type === "media" ? "mixed" : "standalone")}
  {/snippet}
</DrilledMediaList>
