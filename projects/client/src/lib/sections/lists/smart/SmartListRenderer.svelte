<script lang="ts">
  import type { DiscoverMode } from "$lib/features/filters/models/DiscoverMode";
  import GlobalParameterEscaper from "$lib/features/parameters/GlobalParameterEscaper.svelte";
  import SmartListActions from "./_internal/SmartListActions.svelte";
  import SmartListMediaList from "./_internal/SmartListMediaList.svelte";
  import { useSmartLists } from "./useSmartLists";

  import type { Snippet } from "svelte";

  type SmartListRendererProps = {
    mode: DiscoverMode;
    limit?: number;
    empty?: Snippet;
  };

  const { mode, limit, empty }: SmartListRendererProps = $props();

  const { list: lists, isLoading } = $derived(useSmartLists({ mode, limit }));
</script>

{#if !$isLoading && $lists.length === 0}
  {@render empty?.()}
{:else}
  <GlobalParameterEscaper enabled>
    {#each $lists as list (list.key)}
      {#snippet actions()}
        <SmartListActions {list} />
      {/snippet}

      <SmartListMediaList {list} {actions} scope={`smart-list-${list.slug}`} />
    {/each}
  </GlobalParameterEscaper>
{/if}
