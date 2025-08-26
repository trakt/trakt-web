<script lang="ts">
  import type { Snippet } from "svelte";
  import type { LandingStepType, StepsIntl } from "../../StepsIntl";
  import { StepsIntlProvider } from "../StepsIntlProvider";

  const {
    step,
    icon,
    i18n = StepsIntlProvider,
  }: { icon: Snippet; step: LandingStepType; i18n?: StepsIntl } = $props();
</script>

{#snippet label()}
  <h2 class="trakt-landing-step-label-shadow">{i18n.label(step)}</h2>
  <h2 class="trakt-landing-step-label">{i18n.label(step)}</h2>
{/snippet}

<div class="trakt-landing-step">
  {@render icon()}
  {@render label()}
  <p class="trakt-landing-step-description small">{i18n.description(step)}</p>
</div>

<style>
  .trakt-landing-step {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    gap: var(--gap-xxs);

    :global(svg) {
      color: var(--purple-500);
    }
  }

  .trakt-landing-step-label,
  .trakt-landing-step-label-shadow {
    font-size: var(--ni-52);
    text-transform: lowercase;
  }

  .trakt-landing-step-label::after {
    content: ".";
    color: var(--purple-500);
  }

  .trakt-landing-step-label-shadow {
    position: absolute;

    opacity: 0.35;
    filter: blur(var(--ni-4));

    z-index: var(--layer-background);

    color: var(--color-step-shadow-text);
    font-size: var(--ni-96);
  }

  .trakt-landing-step-description {
    max-width: var(--ni-320);
    text-align: center;
  }
</style>
