<script lang="ts" generics="T extends { id: unknown }">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import { mediaListHeightResolver } from "../utils/mediaListHeightResolver";
  import type { DrillListProps } from "./DrillListProps";
  import type { MediaStore } from "./MediaStore";

  type DrillableList<T> = DrillListProps<T> & {
    drilldownLabel: string;
    useList: MediaStore<T>;
  };

  const {
    title,
    drilldownLabel,
    type,
    item,
    useList,
    urlBuilder,
  }: DrillableList<T> = $props();

  const { list } = $derived(useList({ type }));
</script>

<SectionList
  id={`${type}-list`}
  items={$list}
  {item}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet actions()}
    <ViewAllButton href={urlBuilder({ type })} label={drilldownLabel} />
  {/snippet}
</SectionList>
