<script lang="ts" generics="T extends { id: unknown }, M">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import LoadingIndicator from "./_internal/LoadingIndicator.svelte";
  import type { MediaListProps } from "./MediaListProps";

  const {
    id,
    title,
    empty: externalEmpty,
    badge,
    type,
    item,
    actions: externalActions,
    useList,
    filter,
  }: MediaListProps<T, M> = $props();

  const { list, isLoading } = $derived(
    useList({ type, page: 1, limit: DEFAULT_PAGE_SIZE, filter }),
  );

  const defaultVariant = useDefaultCardVariant(type);
</script>

{#snippet actions()}
  {#if externalActions}
    {@render externalActions($list, type)}
  {/if}
{/snippet}

<SectionList
  {id}
  items={$list}
  {badge}
  {item}
  {title}
  actions={externalActions ? actions : undefined}
  --height-list={mediaListHeightResolver($defaultVariant)}
>
  {#snippet empty()}
    {#if !$isLoading}
      {@render externalEmpty?.()}
    {/if}

    {#if $isLoading}
      <LoadingIndicator />
    {/if}
  {/snippet}
</SectionList>
