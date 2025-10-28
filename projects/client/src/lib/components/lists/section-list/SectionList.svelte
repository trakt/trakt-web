<script lang="ts" generics="T extends { key: string }">
  import { type Snippet } from "svelte";
  import type { ListProps } from "../ListProps";
  import ShadowList from "./ShadowList.svelte";

  type SectionListProps<T> = ListProps<T> & {
    id: string;
    empty?: Snippet;
    metaInfo?: string;
  };

  const {
    id,
    items,
    title,
    item,
    ctaItem,
    empty,
    dynamicActions,
    metaInfo,
    actions: externalActions,
    badge,
    drilldownLink,
  }: SectionListProps<T> = $props();
</script>

<ShadowList
  {id}
  {title}
  {metaInfo}
  {items}
  {item}
  {ctaItem}
  {empty}
  {badge}
  {drilldownLink}
>
  {#snippet actions()}
    {#if dynamicActions != null}
      {@render dynamicActions()}
    {/if}

    {#if externalActions != null}
      {@render externalActions()}
    {/if}
  {/snippet}
</ShadowList>
