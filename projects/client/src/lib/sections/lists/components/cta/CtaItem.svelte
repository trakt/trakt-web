<script lang="ts">
  import ActivityCtaCard from "./_internal/ActivityCtaCard.svelte";
  import MediaCtaCard from "./_internal/MediaCtaCard.svelte";
  import type { CtaItemIntl } from "./CtaItemIntl";
  import { CtaItemIntlProvider } from "./CtaItemIntlProvider";
  import type { Cta } from "./models/Cta";

  const {
    cta,
    intl = CtaItemIntlProvider,
  }: {
    cta: Cta;
    intl?: CtaItemIntl;
  } = $props();
</script>

{#if cta === "activity"}
  <ActivityCtaCard {intl} />
{:else}
  <MediaCtaCard {cta} {intl} />
{/if}
