<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Button from "$lib/components/buttons/Button.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";

  type ViewAllLinkProps = HTMLAnchorProps & HTMLElementProps;

  type ViewAllElementProps = HTMLElementProps;

  type ViewAllButtonProps = { label: string; id: string } & (
    | ViewAllElementProps
    | ViewAllLinkProps
  );

  const {
    label,
    id,
    onclick: externalOnclick,
    ...rest
  }: ViewAllButtonProps = $props();

  const { track } = useTrack(AnalyticsEvent.Drilldown);
</script>

<Button
  {label}
  {...rest}
  onclick={(e) => {
    track({ source: id });
    externalOnclick?.(e);
  }}
  style="ghost"
  variant="primary"
  color="purple"
>
  {m.button_text_view_all()}
</Button>
