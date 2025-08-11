<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import CardFooter from "$lib/components/card/CardFooter.svelte";
  import type { Snippet } from "svelte";

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
  <div class="trakt-cta-content">
    {@render children()}
  </div>

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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-cta-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-xs);

    width: var(--width-card);
    height: var(--height-card-cover);

    border-radius: var(--border-radius-m);

    background: linear-gradient(
      258.73deg,
      var(--cm-gradient-stop-cta) 0%,
      var(--shade-900) 53.05%
    );

    padding: var(--ni-16);
    box-sizing: border-box;

    box-shadow:
      0px var(--ni-16) var(--ni-8) 0px var(--cm-shadow-2),
      0px var(--ni-8) var(--ni-4) 0px var(--cm-shadow-4),
      0px var(--ni-4) var(--ni-4) 0px var(--cm-shadow-8),
      0px var(--ni-1) var(--ni-2) 0px var(--cm-shadow-8);

    transition: padding var(--transition-increment) ease-in-out;

    :global(p.smaller) {
      color: var(--shade-10);
    }

    @include for-mobile() {
      padding: var(--ni-10);
    }
  }

  .trakt-cta-footer {
    // To visually align the icon of the ghost button with the card
    margin-right: var(--ni-neg-12);

    :global(.trakt-card-footer) {
      justify-content: flex-end;
    }
  }
</style>
