<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { Snippet } from "svelte";
  import CtaContent from "./CtaContent.svelte";

  const {
    children,
    action,
    variant,
    src,
  }: {
    variant: "portrait" | "landscape" | "activity";
    action?: Snippet;
    src?: string | Nil;
  } & ChildrenProps = $props();
</script>

{#snippet content()}
  <cta-card-content>
    <CtaContent {src}>
      {@render children()}
    </CtaContent>

    {#if action}
      <div class="trakt-cta-footer">
        {@render action()}
      </div>
    {/if}
  </cta-card-content>
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
    display: flex;
    align-items: center;

    height: calc(var(--height-card) - var(--height-card-cover));
    padding: var(--ni-8);
    box-sizing: border-box;

    :global(.trakt-button) {
      height: var(--ni-20);
    }
  }

  cta-card-content {
    :global(.trakt-cta-container) {
      background-color: var(--shade-920);
      color: var(--shade-10);

      &:after {
        background: linear-gradient(
          258.73deg,
          var(--cm-gradient-stop-cta-dark) 0%,
          var(--shade-900) 53.05%
        );
      }
    }
  }
</style>
