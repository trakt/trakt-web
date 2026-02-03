<script lang="ts" generics="T extends { key: string }, M">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import SkeletonList from "../../../components/lists/SkeletonList.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import NoFilterResultsPlaceholder from "./_internal/NoFilterResultsPlaceholder.svelte";
  import type { MediaListProps } from "./MediaListProps";

  const {
    id,
    title,
    empty: externalEmpty,
    type,
    item,
    ctaItem,
    actions: externalActions,
    useList,
    filter,
    filterOverride,
    metaInfo,
    drilldownLink,
    variant: externalVariant,
  }: MediaListProps<T, M> = $props();

  const { list, isLoading } = $derived(
    useList({
      type,
      limit: DEFAULT_PAGE_SIZE,
      filter,
      filterOverride,
    }),
  );

  const defaultVariant = $derived(useDefaultCardVariant(type));
  const variant = $derived(externalVariant ?? $defaultVariant);
  const height = $derived(mediaListHeightResolver(variant));

  const { hasActiveFilter } = useFilter();
</script>

{#snippet actions()}
  {#if externalActions}
    {@render externalActions($list, type)}
  {/if}
{/snippet}

<SectionList
  {id}
  items={$list}
  {item}
  {ctaItem}
  {title}
  {metaInfo}
  {drilldownLink}
  actions={externalActions ? actions : undefined}
  --height-list={height}
>
  {#snippet empty()}
    {#if $isLoading}
      <SkeletonList {id} {variant} />
    {:else if $hasActiveFilter}
      <NoFilterResultsPlaceholder />
    {:else}
      {@render externalEmpty?.()}
    {/if}
  {/snippet}
</SectionList>
