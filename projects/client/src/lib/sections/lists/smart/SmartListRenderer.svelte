<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import AnticipatedList from "../anticipated/AnticipatedList.svelte";
  import PopularList from "../popular/PopularList.svelte";
  import TrendingList from "../trending/TrendingList.svelte";

  import { useSmartLists } from "./useSmartLists";

  type SmartListRendererProps = {
    type: MediaType;
  };

  const { type }: SmartListRendererProps = $props();

  const { list } = $derived(useSmartLists(type));
</script>

<GlobalParameterEscaper enabled>
  {#each $list as collection}
    {#if collection.target === "trending"}
      <TrendingList
        title={collection.title}
        drilldownLabel={m.view_all_items_in({ title: collection.title })}
        type={collection.type}
        search={collection.params}
      />
    {/if}

    {#if collection.target === "anticipated"}
      <AnticipatedList
        title={collection.title}
        drilldownLabel={m.view_all_items_in({ title: collection.title })}
        type={collection.type}
        search={collection.params}
      />
    {/if}

    {#if collection.target === "popular"}
      <PopularList
        title={collection.title}
        drilldownLabel={m.view_all_items_in({ title: collection.title })}
        type={collection.type}
        search={collection.params}
      />
    {/if}
  {/each}
</GlobalParameterEscaper>
