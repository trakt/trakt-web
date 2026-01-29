<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Card from "$lib/components/card/Card.svelte";
  import type { VipPlan } from "./models/VipPlan";

  const { plan }: { plan: VipPlan } = $props();

  const totalCost = $derived(plan.monthlyPrice * plan.duration);
  //TODO formatting
  // TODO responsiveness
  // period labels (e.g use years instead of months)
</script>

<Card
  --width-card="var(--ni-280)"
  --height-card="var(--ni-244)"
  --height-card-cover="var(--ni-244)"
>
  <div class="trakt-subscription-container">
    <div class="trakt-subscription-title">
      <span class="price title">{`$${plan.monthlyPrice}/mo`}</span>
      <span class="billing-cycle secondary"
        >{`$${totalCost} billed every ${plan.duration} months`}</span
      >
    </div>

    <Button
      onclick={() => {
        console.log("TODO trigger stripe");
      }}
      label="TODO"
      color="purple"
      variant="primary"
      style="flat"
      size="small"
    >
      Upgrade to VIP
    </Button>

    <div class="footer">
      <span class="duration secondary">
        {`${plan.duration} month subscription`}
      </span>
    </div>
  </div>
</Card>

<style>
  .trakt-subscription-container {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    padding: var(--ni-24);
    box-sizing: border-box;
  }

  .trakt-subscription-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xs);
  }
</style>
