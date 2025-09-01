<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import { CTA_LIST_CARD_CLASS } from "../constants";
  import CtaContent from "./CtaContent.svelte";

  const {
    children,
    variant,
    src,
  }: {
    variant: "portrait" | "landscape";
    src?: string | Nil;
  } & ChildrenProps = $props();
</script>

{#snippet content()}
  <CtaContent {src}>
    {@render children()}
  </CtaContent>
{/snippet}

{#if variant === "portrait"}
  <Card
    variant="transparent"
    --width-card="var(--width-cta-list-placeholder-card)"
    --height-card="var(--height-portrait-card)"
    --height-card-cover="var(--height-portrait-card)"
    classList={CTA_LIST_CARD_CLASS}
  >
    {@render content()}
  </Card>
{/if}

{#if variant === "landscape"}
  <Card
    variant="transparent"
    --width-card="var(--width-cta-list-placeholder-card)"
    --height-card="var(--height-landscape-card)"
    --height-card-cover="var(--height-landscape-card)"
    classList={CTA_LIST_CARD_CLASS}
  >
    {@render content()}
  </Card>
{/if}
