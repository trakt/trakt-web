<script lang="ts">
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { teaserFacts } from "./teaserFacts.ts";
</script>

{#snippet teaser()}
  <section class="trakt-trivia-upsell">
    <h2 class="upsell-heading">{m.list_title_trivia()}</h2>

    <div class="upsell-board">
      <ul class="upsell-list" aria-hidden="true">
        {#each teaserFacts as fact (fact.key)}
          <li class="upsell-fact">
            <span class="fact-icon"><SparkleIcon /></span>
            <p class="fact-body">{fact.text}</p>
          </li>
        {/each}
      </ul>

      <UpsellCta source="trivia">
        {m.vip_feature_description_trivia()}
      </UpsellCta>
    </div>
  </section>
{/snippet}

<!-- `free` is signed-in non-VIP, `public` is signed out. The endpoint returns
     nothing for both, so neither may be shown a section that reads as "this
     title has no trivia". -->
<RenderFor audience="free">
  {@render teaser()}
</RenderFor>

<RenderFor audience="public">
  {@render teaser()}
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-trivia-upsell {
    display: flex;
    flex-direction: column;
    gap: var(--list-header-gap);

    padding-inline: var(--layout-distance-side);
  }

  .upsell-heading {
    margin: 0;
  }

  .upsell-board {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    width: fit-content;

    @include for-mobile {
      width: 100%;
    }
  }

  .upsell-list {
    display: flex;
    flex-direction: column;
    gap: var(--ni-12);

    box-sizing: border-box;
    max-width: var(--width-trivia-card);
    margin: 0;
    padding: var(--ni-20);

    list-style: none;

    /* The real card's surface, so the teaser reads as the section it stands
       in for rather than as a different component. */
    background: var(--background-vip-drawer);
    border-radius: var(--border-radius-xl);

    /* A sample, not this title's trivia - blurred so it reads as a preview of
       the feature rather than as real facts. */
    filter: blur(var(--ni-4));
    user-select: none;
    pointer-events: none;

    @include for-mobile {
      max-width: none;
    }
  }

  .upsell-fact {
    display: flex;
    align-items: flex-start;
    gap: var(--ni-12);
  }

  .fact-icon {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: var(--ni-24);
    height: var(--ni-24);

    color: var(--color-text-secondary);

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }

  .fact-body {
    margin: 0;
    line-height: 1.5;
  }
</style>
