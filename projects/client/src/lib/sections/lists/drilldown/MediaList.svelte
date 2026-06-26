<script lang="ts" generics="T extends { key: string }, M">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import { checksum } from "$lib/utils/string/checksum";
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
    ctaItem: externalCtaItem,
    actions: externalActions,
    useList,
    filter,
    filterOverride,
    metaInfo,
    drilldown,
    variant: externalVariant,
    titleAction,
    contentKey,
  }: MediaListProps<T, M> = $props();

  const { list, isLoading } = $derived(
    useList({
      type,
      limit: DEFAULT_PAGE_SIZE,
      filter,
      filterOverride,
    }),
  );

  /*
    The filter values are used as the content hash to ensure list
    scroll position is reset when applying/changing filters.
  */
  const contentHash = $derived(
    checksum(
      JSON.stringify({
        type,
        filter: filter ?? {},
        filterOverride: filterOverride ?? {},
        contentKey: contentKey ?? {},
      }),
    ),
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
  {title}
  {metaInfo}
  {drilldown}
  {titleAction}
  actions={externalActions ? actions : undefined}
  {contentHash}
  --height-list={height}
>
  {#snippet empty()}
    {#if $isLoading}
      <SkeletonList id={id.scope} {variant} />
    {:else if $hasActiveFilter}
      <NoFilterResultsPlaceholder />
    {:else}
      {@render externalEmpty?.()}
    {/if}
  {/snippet}

  {#snippet ctaItem()}
    {#if !$hasActiveFilter}
      {@render externalCtaItem?.()}
    {/if}
  {/snippet}
</SectionList>
