<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import ViewAllIcon from "$lib/components/icons/ViewAllIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { DrilldownSource } from "./models/DrilldownSource";

  type ViewAllLinkProps = HTMLAnchorProps & HTMLElementProps;

  type ViewAllElementProps = HTMLElementProps;

  type ViewAllButtonProps = { label: string; source: DrilldownSource } & (
    | ViewAllElementProps
    | ViewAllLinkProps
  );

  const {
    label,
    source,
    onclick: externalOnclick,
    ...rest
  }: ViewAllButtonProps = $props();

  const { track } = useTrack(AnalyticsEvent.Drilldown);
</script>

<ActionButton
  {label}
  {...rest}
  style="ghost"
  onclick={(e) => {
    track({ source: source.id, type: source.type });
    externalOnclick?.(e);
  }}
>
  <ViewAllIcon />
</ActionButton>
