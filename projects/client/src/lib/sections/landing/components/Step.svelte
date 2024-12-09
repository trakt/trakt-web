<script lang="ts">
  import type { LandingStepType, StepsIntl } from "../StepsIntl";

  type StepProps = {
    step: LandingStepType;
    i18n: StepsIntl;
    number: number;
  };

  const { step, i18n, number }: StepProps = $props();
</script>

<div class="trakt-landing-step">
  <div class="trakt-landing-step-label">
    <h1>{i18n.label(step)}</h1>
  </div>
  <div class="trakt-landing-step-description">
    <span class="display-title">{number}</span>
    <p class="large">{i18n.description(step)}</p>
  </div>
</div>

<style>
  .trakt-landing-step-label {
    padding-left: var(--ni-64);

    h1:after {
      content: ".";
      color: var(--purple-500);
    }
  }

  .trakt-landing-step-description {
    display: flex;
    padding-left: var(--ni-12);

    span {
      color: var(--purple-500);
      opacity: 0.5;
      transform: rotate(-90deg);
      line-height: var(--ni-52);
    }

    p {
      margin-left: var(--ni-24);
      max-width: var(--ni-252);
    }
  }
</style>
