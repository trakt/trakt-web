<script lang="ts">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import * as m from "$lib/features/i18n/messages";
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import AnticipatedList from "../anticipated/AnticipatedList.svelte";
  import PopularList from "../popular/PopularList.svelte";
  import TrendingList from "../trending/TrendingList.svelte";
  import SmartListActions from "./_internal/SmartListActions.svelte";
  import { useSmartLists } from "./useSmartLists";

  import type { Snippet } from "svelte";

  type SmartListRendererProps = {
    mode: DiscoverMode;
    limit?: number;
    empty?: Snippet;
  };

  const { mode, limit, empty }: SmartListRendererProps = $props();

  const { list: lists, isLoading } = $derived(useSmartLists({ mode, limit }));

  const getListProps = (list: SmartList) => ({
    title: list.title,
    drilldownLabel: m.button_label_view_all_items_in({
      title: list.title,
    }),
    type: list.type,
    search: list.params,
    urlBuilder: () => UrlBuilder.lists.smart.view(list.id),
  });
</script>

{#if !$isLoading && $lists.length === 0}
  {@render empty?.()}
{:else}
  <GlobalParameterEscaper enabled>
    {#each $lists as list (list.id)}
      {@const scope = `smart-list-${list.target}-${list.key}`}

      {#snippet actions()}
        <SmartListActions {list} />
      {/snippet}

      {#if list.target === "trending"}
        <TrendingList {...getListProps(list)} {actions} {scope} />
      {/if}

      {#if list.target === "anticipated"}
        <AnticipatedList {...getListProps(list)} {actions} {scope} />
      {/if}

      {#if list.target === "popular"}
        <PopularList {...getListProps(list)} {actions} {scope} />
      {/if}
    {/each}
  </GlobalParameterEscaper>
{/if}
