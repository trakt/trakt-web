<script lang="ts">
  import type { RateNowProps } from "../rating/models/RateNowProps";
  import RateNow from "../rating/RateNow.svelte";

  const { ...target }: RateNowProps = $props();
</script>

<div class="trakt-summary-rate-now">
  <RateNow {...target} />
</div>

<style>
  .trakt-summary-rate-now {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);

    width: 100%;


    :global(.trakt-action-button[disabled]) {
      background-color: transparent;
      opacity: 0.3;
    }
  }
</style>
