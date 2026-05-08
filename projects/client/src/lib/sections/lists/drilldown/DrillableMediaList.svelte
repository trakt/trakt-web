<script lang="ts" generics="T extends { key: string }, M">
  import type { Snippet } from "svelte";
  import type { DrilldownSource } from "../components/models/DrilldownSource";
  import type { DrillListProps } from "./DrillListProps";
  import MediaList from "./MediaList.svelte";
  import type { MediaListProps } from "./MediaListProps";

  type DrillableList<T, M> = MediaListProps<T, M> &
    DrillListProps<M> & {
      drilldownLabel: string;
      empty?: Snippet;
      badge?: Snippet;
      source: DrilldownSource;
      titleAction?: Snippet;
    };

  const {
    drilldownLabel,
    source,
    urlBuilder,
    actions: externalActions,
    titleAction,
    ...props
  }: DrillableList<T, M> = $props();

  const drilldown = $derived.by(() => {
    if (props.filterOverride) {
      return undefined;
    }

    return {
      href: urlBuilder({ type: props.type, ...props.filter }),
      label: drilldownLabel,
      source,
    };
  });
</script>

<MediaList {...props} {drilldown} {titleAction}>
  {#snippet actions(items)}
    {@render externalActions?.(items, props.type)}
  {/snippet}
</MediaList>
