<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { Snippet } from "svelte";
  import CtaContent from "./CtaContent.svelte";

  const {
    children,
    variant,
    icon,
    coverSrc,
  }: {
    variant: "portrait" | "landscape";
    icon: Snippet;
    coverSrc?: string | Nil;
  } & ChildrenProps = $props();
</script>

{#snippet content()}
  <CtaContent {coverSrc} {icon}>
    {@render children()}
  </CtaContent>
{/snippet}

{#if variant === "portrait"}
  <Card
    variant="transparent"
    --width-card="100%"
    --height-card="var(--height-portrait-card)"
    --height-card-cover="var(--height-portrait-card)"
  >
    {@render content()}
  </Card>
{/if}

{#if variant === "landscape"}
  <Card
    variant="transparent"
    --width-card="100%"
    --height-card="var(--height-landscape-card)"
    --height-card-cover="var(--height-landscape-card)"
  >
    {@render content()}
  </Card>
{/if}
