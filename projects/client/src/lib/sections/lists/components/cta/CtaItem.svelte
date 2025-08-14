<script lang="ts">
  import ActivityCtaCard from "./_internal/ActivityCtaCard.svelte";
  import ActivityCtaPlaceholder from "./_internal/ActivityCtaPlaceholder.svelte";
  import MediaCtaCard from "./_internal/MediaCtaCard.svelte";
  import MediaCtaPlaceholder from "./_internal/MediaCtaPlaceholder.svelte";
  import { CtaItemIntlProvider } from "./CtaItemIntlProvider";
  import { CtaPlaceholderIntlProvider } from "./CtaPlaceholderIntlProvider";
  import type { Cta } from "./models/Cta";

  const {
    cta,
    variant,
  }: {
    cta: Cta;
    variant: "card" | "placeholder";
  } = $props();
</script>

<div class="trakt-cta-item">
  {#if variant === "card"}
    {#if cta === "activity"}
      <ActivityCtaCard intl={CtaItemIntlProvider} />
    {:else}
      <MediaCtaCard {cta} intl={CtaItemIntlProvider} />
    {/if}
  {/if}

  {#if variant === "placeholder"}
    {#if cta === "activity"}
      <ActivityCtaPlaceholder intl={CtaPlaceholderIntlProvider} />
    {:else}
      <MediaCtaPlaceholder {cta} intl={CtaPlaceholderIntlProvider} />
    {/if}
  {/if}
</div>

<style>
  .trakt-cta-item {
    animation: fadeIn var(--transition-increment) ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
