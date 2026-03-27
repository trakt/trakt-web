<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { DrilldownSource } from "./models/DrilldownSource";

  type ViewAllLinkProps = HTMLAnchorProps & HTMLElementProps;

  type ViewAllElementProps = HTMLElementProps;

  type ViewAllButtonProps = {
    label: string;
    source: DrilldownSource;
    size?: "normal" | "small";
  } & (ViewAllElementProps | ViewAllLinkProps);

  const {
    label,
    source,
    onclick: externalOnclick,
    size,
    ...rest
  }: ViewAllButtonProps = $props();

  const { track } = useTrack(AnalyticsEvent.Drilldown);
</script>

<ActionButton
  {label}
  {size}
  {...rest}
  classList="trakt-view-all-button"
  style="ghost"
  onclick={(e) => {
    track({ source: source.id, type: source.type });
    externalOnclick?.(e);
  }}
>
  <CaretRightIcon />
</ActionButton>
