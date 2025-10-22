<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import ActivityCtaCard from "./_internal/ActivityCtaCard.svelte";
  import ActivityCtaPlaceholder from "./_internal/ActivityCtaPlaceholder.svelte";
  import ListCtaCard from "./_internal/ListCtaCard.svelte";
  import ListCtaPlaceholder from "./_internal/ListCtaPlaceholder.svelte";
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
    {#if cta.type === "activity" || cta.type === "social"}
      <ActivityCtaCard intl={CtaItemIntlProvider} {cta} />
    {:else if cta.type === "personal-list"}
      <ListCtaCard intl={CtaItemIntlProvider} {cta} />
    {:else}
      <MediaCtaCard {cta} intl={CtaItemIntlProvider} />
    {/if}
  {/if}

  {#if variant === "placeholder"}
    <div
      data-dpad-navigation={DpadNavigationType.List}
      class="trakt-cta-list-placeholder"
    >
      {#if cta.type === "activity" || cta.type === "social"}
        <ActivityCtaPlaceholder intl={CtaPlaceholderIntlProvider} {cta} />
      {:else if cta.type === "personal-list"}
        <ListCtaPlaceholder intl={CtaPlaceholderIntlProvider} {cta} />
      {:else}
        <MediaCtaPlaceholder {cta} intl={CtaPlaceholderIntlProvider} />
      {/if}
    </div>
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

  .trakt-cta-list-placeholder {
    :global(.trakt-card[data-navigation-type="dpad"]) {
      :global(.trakt-card-content) {
        transform: none;
      }
    }
  }
</style>
