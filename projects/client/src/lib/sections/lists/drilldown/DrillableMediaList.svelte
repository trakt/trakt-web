<script lang="ts" generics="T extends { id: unknown }">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import type { DrillListProps } from "./DrillListProps";
  import type { MediaStore } from "./MediaStore";

  type DrillableList<T> = DrillListProps<T> & {
    drilldownLabel: string;
    useList: MediaStore<T>;
    emptyMessage?: string;
  };

  const {
    title,
    drilldownLabel,
    emptyMessage,
    type,
    item,
    useList,
    urlBuilder,
  }: DrillableList<T> = $props();

  const { list, isLoading } = $derived(useList({ type }));
  const isEmptyList = $derived(!$isLoading && $list.length === 0);
</script>

<SectionList
  id={`${type}-list`}
  items={$list}
  {item}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet actions()}
    <ViewAllButton
      href={urlBuilder({ type })}
      label={drilldownLabel}
      isDisabled={isEmptyList}
    />
  {/snippet}

  {#snippet empty()}
    {#if !$isLoading && emptyMessage}
      <p class="small secondary">
        {emptyMessage}
      </p>
    {/if}
  {/snippet}
</SectionList>
