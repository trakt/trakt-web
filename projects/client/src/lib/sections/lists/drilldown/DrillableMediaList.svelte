<script lang="ts" generics="T extends { key: string }, M">
  import type { Snippet } from "svelte";
  import type { DrilldownSource } from "../components/models/DrilldownSource";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import type { DrillListProps } from "./DrillListProps";
  import MediaList from "./MediaList.svelte";
  import type { MediaListProps } from "./MediaListProps";

  type DrillableList<T, M> = MediaListProps<T, M> &
    DrillListProps<M> & {
      drilldownLabel: string;
      empty?: Snippet;
      badge?: Snippet;
      source: DrilldownSource;
    };

  const { drilldownLabel, source, urlBuilder, ...props }: DrillableList<T, M> =
    $props();

  const href = $derived(urlBuilder({ type: props.type, ...props.filter }));
</script>

<MediaList {...props} drilldownLink={href}>
  {#snippet actions(items)}
    {#if !props.filterOverride}
      <ViewAllButton
        {href}
        label={drilldownLabel}
        disabled={items.length === 0}
        {source}
      />
    {/if}
  {/snippet}
</MediaList>
