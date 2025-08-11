<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import SearchIcon from "$lib/features/search/SearchIcon.svelte";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { CtaItemIntl } from "../CtaItemIntl";
  import type { Cta } from "../models/Cta";
  import CtaCard from "./CtaCard.svelte";

  const {
    cta,
    intl,
  }: {
    cta: Exclude<Cta, "activity">;
    intl: CtaItemIntl;
  } = $props();

  const type = $derived(
    cta === "up-next" || cta === "upcoming" ? "episode" : "movie",
  );

  const defaultVariant = $derived(useDefaultCardVariant(type));

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

<CtaCard variant={$defaultVariant}>
  <p class="smaller">{intl.text({ cta })}</p>

  {#snippet action()}
    <Button
      href={ctaHref}
      label={intl.cta.label({ cta })}
      size="small"
      color="purple"
      style="ghost"
    >
      {intl.cta.text({ cta })}
      {#snippet icon()}
        <SearchIcon />
      {/snippet}
    </Button>
  {/snippet}
</CtaCard>
