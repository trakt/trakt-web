<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { Snippet } from "svelte";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { Cta } from "../models/Cta";

  const {
    cta,
    intl,
    size,
    icon,
  }: {
    cta: Exclude<Cta, "activity">;
    intl: CtaItemIntl;
    size: "small" | "tag";
    icon?: Snippet;
  } = $props();

  const { track } = useTrack(AnalyticsEvent.Cta);
  const color = $derived(size === "small" ? "purple" : "default");

  const ctaHref = $derived.by(() => {
    switch (cta) {
      case "up-next":
      case "personal-activity":
        return UrlBuilder.shows();
      case "released":
        return UrlBuilder.trending({ type: "movie" });
      case "upcoming":
        return UrlBuilder.shows();
      case "unreleased":
        return UrlBuilder.anticipated({ type: "movie" });
    }
  });
</script>

<Button
  href={ctaHref}
  label={intl.cta.label({ cta })}
  onclick={() => track({ type: cta })}
  {size}
  {color}
  {icon}
  variant="primary"
  style="flat"
>
  {intl.cta.text({ cta })}
</Button>
