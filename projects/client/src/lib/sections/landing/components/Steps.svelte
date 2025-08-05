<script>
  import { LandingStepType } from "../StepsIntl";
  import { StepsIntlProvider } from "../StepsIntlProvider";
  import JoinForFreeButton from "./JoinForFreeButton.svelte";
  import Step from "./Step.svelte";

  const steps = [
    LandingStepType.Discover,
    LandingStepType.Track,
    LandingStepType.Share,
  ];
</script>

<div class="trakt-landing-steps">
  {#each steps as step, index}
    <Step {step} i18n={StepsIntlProvider} number={index + 1} />
  {/each}
  <div class="trakt-landing-join">
    <JoinForFreeButton />
    <p class="meta-info secondary">*trakt does not provide streaming</p>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-landing-steps {
    display: grid;
    gap: var(--gap-xl);
    margin-top: var(--ni-64);
    height: fit-content;

    transition: margin var(--transition-increment) ease-in-out;

    :global(.trakt-button) {
      width: fit-content;
    }

    @include for-tablet-lg-and-below {
      margin-top: 0;
    }
  }

  .trakt-landing-join {
    display: grid;
    gap: var(--gap-m);
    padding-left: var(--ni-64);
  }
</style>
