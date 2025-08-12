<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import SearchIcon from "$lib/features/search/SearchIcon.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { Cta } from "../models/Cta";

  const {
    cta,
    intl,
    style,
  }: {
    cta: Exclude<Cta, "activity">;
    intl: CtaItemIntl;
    style: "ghost" | "flat";
  } = $props();

  const ctaHref = $derived.by(() => {
    switch (cta) {
      case "up-next":
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
  size="small"
  color="purple"
  {style}
>
  {intl.cta.text({ cta })}
  {#snippet icon()}
    <SearchIcon />
  {/snippet}
</Button>
