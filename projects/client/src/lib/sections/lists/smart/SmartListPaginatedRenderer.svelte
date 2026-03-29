<script lang="ts">
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery";
  import AnticipatedPaginatedList from "../anticipated/AnticipatedPaginatedList.svelte";
  import PopularPaginatedList from "../popular/PopularPaginatedList.svelte";
  import TrendingPaginatedList from "../trending/TrendingPaginatedList.svelte";

  type PaginatedSmartListRendererProps = {
    list: SmartList;
  };

  const { list }: PaginatedSmartListRendererProps = $props();

  const commonProps = $derived({
    type: list.type,
    search: list.params,
  });
</script>

<GlobalParameterEscaper enabled>
  {#if list.target === "trending"}
    <TrendingPaginatedList {...commonProps} />
  {/if}

  {#if list.target === "anticipated"}
    <AnticipatedPaginatedList {...commonProps} />
  {/if}

  {#if list.target === "popular"}
    <PopularPaginatedList {...commonProps} />
  {/if}
</GlobalParameterEscaper>
