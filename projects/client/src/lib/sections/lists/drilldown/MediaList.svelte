<script lang="ts" generics="T extends { id: unknown }, M">
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
    badge,
    type,
    item,
    ctaItem,
    actions: externalActions,
    useList,
    filter,
  }: MediaListProps<T, M> = $props();

  const { list, isLoading } = $derived(
    useList({ type, page: 1, limit: DEFAULT_PAGE_SIZE, filter }),
  );

  const defaultVariant = useDefaultCardVariant(type);
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
  {badge}
  {item}
  {ctaItem}
  {title}
  actions={externalActions ? actions : undefined}
  --height-list={mediaListHeightResolver($defaultVariant)}
>
  {#snippet empty()}
    {#if $isLoading}
      <SkeletonList {id} variant={$defaultVariant} />
    {:else if $hasActiveFilter}
      <NoFilterResultsPlaceholder />
    {:else}
      {@render externalEmpty?.()}
    {/if}
  {/snippet}
</SectionList>
