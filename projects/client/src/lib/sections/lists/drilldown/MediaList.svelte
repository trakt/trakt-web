<script lang="ts" generics="T extends { key: string }, M">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useFilter } from "$lib/features/filters/useFilter";
  import { useVarToPixels } from "$lib/stores/css/useVarToPixels";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { DEFAULT_PAGE_SIZE } from "$lib/utils/constants";
  import SkeletonList from "../../../components/lists/SkeletonList.svelte";
  import ViewAllCard from "../components/ViewAllCard.svelte";
  import { mediaCardWidthResolver } from "../utils/mediaCardWidthResolver";
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
    filterOverride,
    metaInfo,
    drilldownLink,
    variant: externalVariant,
    isLimitedList = false,
  }: MediaListProps<T, M> & { isLimitedList?: boolean } = $props();

  const { list, isLoading } = $derived(
    useList({
      type,
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      filter,
      filterOverride,
    }),
  );

  const defaultVariant = useDefaultCardVariant(type);
  const variant = $derived(externalVariant ?? $defaultVariant);
  const height = $derived(mediaListHeightResolver(variant));

  const { hasActiveFilter } = useFilter();

  const itemWidth = $derived(useVarToPixels(mediaCardWidthResolver(variant)));
</script>

{#snippet actions()}
  {#if externalActions}
    {@render externalActions($list, type)}
  {/if}
{/snippet}

{#snippet actionCard()}
  {#if drilldownLink}
    <ViewAllCard {variant} href={drilldownLink} />
  {/if}
{/snippet}

<SectionList
  {id}
  items={$list}
  {badge}
  {item}
  {ctaItem}
  {title}
  {metaInfo}
  {drilldownLink}
  actions={externalActions ? actions : undefined}
  --height-list={height}
  variant={isLimitedList
    ? { type: "limit", itemWidth: $itemWidth, actionCard }
    : undefined}
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
