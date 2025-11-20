<script lang="ts" generics="T extends { key: string }, M">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { Snippet } from "svelte";
  import type { DrilldownSource } from "../components/models/DrilldownSource";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import { useIsLimitedList } from "../stores/useIsLimitedList";
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

  const isLimitedList = useIsLimitedList();
</script>

{#snippet viewAllAction(isDisabled: boolean)}
  {#if !props.filterOverride}
    <ViewAllButton
      {href}
      label={drilldownLabel}
      disabled={isDisabled}
      {source}
    />
  {/if}
{/snippet}

<MediaList {...props} drilldownLink={href} isLimitedList={$isLimitedList}>
  {#snippet actions(items)}
    <RenderForFeature flag={FeatureFlag.LimitLists}>
      {#snippet enabled()}
        <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
          {@render viewAllAction(items.length === 0)}
        </RenderFor>
      {/snippet}

      {@render viewAllAction(items.length === 0)}
    </RenderForFeature>
  {/snippet}
</MediaList>
