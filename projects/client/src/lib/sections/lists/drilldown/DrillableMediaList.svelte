<script lang="ts" generics="T extends { id: unknown }, M">
  import type { Snippet } from "svelte";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import type { DrillListProps } from "./DrillListProps";
  import MediaList from "./MediaList.svelte";
  import type { MediaListProps } from "./MediaListProps";

  type DrillableList<T, M> = MediaListProps<T, M> &
    DrillListProps<M> & {
      drilldownLabel: string;
      empty?: Snippet;
      badge?: Snippet;
    };

  const { drilldownLabel, urlBuilder, ...props }: DrillableList<T, M> =
    $props();
</script>

<MediaList {...props}>
  {#snippet actions(items, type)}
    <ViewAllButton
      href={urlBuilder({ type, ...props.filter })}
      label={drilldownLabel}
      disabled={items.length === 0}
      id={props.id}
    />
  {/snippet}
</MediaList>
