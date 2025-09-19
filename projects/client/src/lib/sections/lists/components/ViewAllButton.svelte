<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Button from "$lib/components/buttons/Button.svelte";
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

<Button
  {label}
  {...rest}
  onclick={(e) => {
    track({ source: source.id, type: source.type });
    externalOnclick?.(e);
  }}
  style="ghost"
  variant="primary"
  color="purple"
>
  {m.button_text_view_all()}
</Button>
