<script lang="ts">
  import DiscoverIcon from "$lib/components/icons/DiscoverIcon.svelte";
  import ShareIcon from "$lib/components/icons/ShareIcon.svelte";
  import TrackIcon from "$lib/components/TrackIcon.svelte";
  import { LandingStepType } from "../StepsIntl";
  import Step from "./Step.svelte";
</script>

<div class="trakt-landing-steps">
  <Step step={LandingStepType.Discover}>
    {#snippet icon()}
      <DiscoverIcon />
    {/snippet}
  </Step>
  <Step step={LandingStepType.Track}>
    {#snippet icon()}
      <TrackIcon />
    {/snippet}
  </Step>
  <Step step={LandingStepType.Share}>
    {#snippet icon()}
      <ShareIcon />
    {/snippet}
  </Step>
</div>

<style>
  .trakt-landing-steps {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;

    max-height: var(--ni-520);

    gap: var(--gap-s);

    margin-top: calc(-1 * var(--gap-s));
  }
</style>
