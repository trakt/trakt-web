<script lang="ts">
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import type { SmartList } from "$lib/requests/queries/users/smartListQuery";
  import AnticipatedPaginatedList from "../anticipated/AnticipatedPaginatedList.svelte";
  import PopularPaginatedList from "../popular/PopularPaginatedList.svelte";
  import TrendingPaginatedList from "../trending/TrendingPaginatedList.svelte";
  import SmartListActions from "./_internal/SmartListActions.svelte";

  type PaginatedSmartListRendererProps = {
    list: SmartList;
  };

  const { list }: PaginatedSmartListRendererProps = $props();

  const commonProps = $derived({
    title: list.title,
    type: list.type,
    search: list.params,
  });
</script>

{#snippet actions()}
  <SmartListActions {list} />
{/snippet}

<GlobalParameterEscaper enabled>
  {#if list.target === "trending"}
    <TrendingPaginatedList {...commonProps} {actions} />
  {/if}

  {#if list.target === "anticipated"}
    <AnticipatedPaginatedList {...commonProps} {actions} />
  {/if}

  {#if list.target === "popular"}
    <PopularPaginatedList {...commonProps} {actions} />
  {/if}
</GlobalParameterEscaper>
