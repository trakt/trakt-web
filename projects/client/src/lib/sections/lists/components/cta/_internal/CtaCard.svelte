<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import type { Snippet } from "svelte";
  import CtaContent from "./CtaContent.svelte";

  const {
    children,
    action,
    variant,
  }: {
    variant: "portrait" | "landscape" | "activity";
    action?: Snippet;
  } & ChildrenProps = $props();
</script>

{#snippet content()}
  <CtaContent>
    {@render children()}
  </CtaContent>

  {#if action}
    <div class="trakt-cta-footer">
      <CardFooter {action} />
    </div>
  {/if}
{/snippet}

{#if variant === "portrait"}
  <Card
    variant="transparent"
    --width-card="var(--width-cta-portrait-card)"
    --height-card="var(--height-cta-portrait-card)"
    --height-card-cover="var(--height-cta-portrait-card-cover)"
  >
    {@render content()}
  </Card>
{/if}

{#if variant === "landscape"}
  <Card
    variant="transparent"
    --width-card="var(--width-cta-landscape-card)"
    --height-card="var(--height-cta-landscape-card)"
    --height-card-cover="var(--height-cta-landscape-card-cover)"
  >
    {@render content()}
  </Card>
{/if}

{#if variant === "activity"}
  <Card
    variant="transparent"
    --width-card="var(--width-cta-activity-card)"
    --height-card="var(--height-cta-activity-card)"
    --height-card-cover="var(--height-cta-activity-card)"
  >
    {@render content()}
  </Card>
{/if}

<style>
  .trakt-cta-footer {
    /* To visually align the icon of the ghost button with the card */
    margin-right: var(--ni-neg-12);

    :global(.trakt-card-footer) {
      justify-content: flex-end;
    }
  }
</style>
