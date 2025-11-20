<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import LandscapeCard from "$lib/components/media/card/LandscapeCard.svelte";
  import PortraitCard from "$lib/components/media/card/PortraitCard.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import MiniCardIcon from "./_internal/MiniCardIcon.svelte";

  const {
    variant = "portrait",
    href,
  }: {
    href: string;
    variant?: "portrait" | "landscape";
  } = $props();

  const miniCardCount = $derived(variant === "landscape" ? 6 : 9);
</script>

{#snippet viewAllContent()}
  <div class="trakt-view-all-card-content">
    <Link {href}>
      <div
        class="trakt-view-all-card-cover"
        class:is-landscape={variant === "landscape"}
      >
        {#each Array(miniCardCount) as _}
          <MiniCardIcon {variant} />
        {/each}
      </div>
    </Link>
    <div class="trakt-view-all-card-footer">
      <p class="bold">{m.text_view_all()}</p>
    </div>
  </div>
{/snippet}

{#if variant === "portrait"}
  <PortraitCard>
    {@render viewAllContent()}
  </PortraitCard>
{/if}

{#if variant === "landscape"}
  <LandscapeCard>
    {@render viewAllContent()}
  </LandscapeCard>
{/if}

<style>
  .trakt-view-all-card-cover {
    background-color: var(--color-view-all-card-background);
    color: var(--color-view-all-card-foreground);

    transition: color var(--transition-increment) ease-in-out;

    border-radius: var(--border-radius-m);

    width: var(--width-card);
    height: var(--height-card-cover);

    box-sizing: border-box;
    padding: var(--gap-xs);

    overflow: hidden;

    display: grid;
    gap: var(--gap-xs);

    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;

    justify-items: center;
    align-items: center;

    &.is-landscape {
      grid-template-rows: 1fr 1fr;
    }

    &:not(.is-landscape) {
      :global(svg) {
        height: var(--ni-52);
        width: auto;
      }
    }

    &:hover {
      color: var(--color-view-all-card-hover);
    }
  }

  .trakt-view-all-card-footer {
    margin-top: var(--ni-8);
  }
</style>
