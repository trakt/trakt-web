<script lang="ts">
  import ActivityCtaCard from "./_internal/ActivityCtaCard.svelte";
  import ActivityCtaPlaceholder from "./_internal/ActivityCtaPlaceholder.svelte";
  import MediaCtaCard from "./_internal/MediaCtaCard.svelte";
  import MediaCtaPlaceholder from "./_internal/MediaCtaPlaceholder.svelte";
  import type { CtaItemIntl } from "./CtaItemIntl";
  import { CtaItemIntlProvider } from "./CtaItemIntlProvider";
  import type { Cta } from "./models/Cta";

  const {
    cta,
    variant,
    intl = CtaItemIntlProvider,
  }: {
    cta: Cta;
    variant: "card" | "placeholder";
    intl?: CtaItemIntl;
  } = $props();
</script>

{#if variant === "card"}
  {#if cta === "activity"}
    <ActivityCtaCard {intl} />
  {:else}
    <MediaCtaCard {cta} {intl} />
  {/if}
{/if}

{#if variant === "placeholder"}
  {#if cta === "activity"}
    <ActivityCtaPlaceholder {intl} />
  {:else}
    <MediaCtaPlaceholder {cta} {intl} />
  {/if}
{/if}
