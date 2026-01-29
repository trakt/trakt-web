<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Card from "$lib/components/card/Card.svelte";
  import type { VipPlan } from "./models/VipPlan";

  const plan: VipPlan = {
    type: "two_years",
    monthlyPrice: 4,
    duration: 24,
  };

  // Test token from local DB
  const token =
    "e3557ae0a4129caf089b82e61f2157d1740eb8fd613ecbdc23d0a52bfda0c917";

  // TODO reduce duplication with SubscriptionCard
  const startUpdateCreditCard = async () => {
    const endpoint = `/local-api/vip/sadtrombone`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ return_to: window.location.href }),
    });

    if (!response.ok) {
      console.error("Unsubscribe failed", response);
      return;
    }

    const data = await response.json();
    console.log("Unsubscribe DATA", data);
    globalThis.window.location = data.url;
  };
</script>

<Card
  --width-card="var(--ni-280)"
  --height-card="var(--ni-120)"
  --height-card-cover="var(--ni-120)"
>
  <div class="trakt-subscription-container">
    <Button
      onclick={startUpdateCreditCard}
      label="TODO"
      color="purple"
      variant="primary"
      style="flat"
      size="small"
    >
      Unsubscribe
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
</style>
