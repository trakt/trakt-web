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

<style>
  .trakt-landing-steps {
    display: grid;
    gap: var(--ni-32);
    margin-top: var(--ni-64);
    height: fit-content;

    :global(.trakt-button) {
      width: fit-content;
    }
  }

  .trakt-landing-join {
    display: grid;
    gap: var(--ni-16);
    padding-left: var(--ni-64);
  }
</style>
