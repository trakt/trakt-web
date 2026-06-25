<script lang="ts">
  import TabView from "$lib/components/tabs/TabView.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { type VipSubscription } from "$lib/requests/models/VipSubscription";
  import PaymentHistory from "./PaymentHistory.svelte";
  import UsageLimits from "./UsageLimits.svelte";
  import VipContentContainer from "./VipContentContainer.svelte";

  const { subscription }: { subscription: VipSubscription | Nil } = $props();

  let activeTab = $state("usage");

  const onChange = (to: string) => {
    activeTab = to;
  };

  const hasPaymentHistory = $derived(
    (subscription?.transactions ?? []).length > 0,
  );
</script>

{#snippet usageLimits()}
  <UsageLimits />
{/snippet}

{#snippet history()}
  <PaymentHistory transactions={subscription?.transactions ?? []} />
{/snippet}

<VipContentContainer>
  <div class="trakt-vip-usage-tabs">
    {#if hasPaymentHistory}
      <TabView
        value={activeTab}
        tabs={[
          {
            value: "usage",
            label: m.button_text_usage(),
            content: usageLimits,
          },
          {
            value: "history",
            label: m.button_text_history(),
            content: history,
          },
        ]}
        {onChange}
      />
    {:else}
      {@render usageLimits()}
    {/if}
  </div>
</VipContentContainer>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-usage-tabs {
    width: 100%;
    max-width: var(--ni-768);
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    background: var(--background-usage-limits-card);
    box-shadow: var(--shadow-base);

    border-radius: var(--border-radius-xxl);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 50%, transparent);

    /* Match the account card's padding so the row icons line up with it. */
    padding: var(--ni-24);

    @include for-tablet-sm-and-below {
      padding: var(--ni-18);
    }

    :global(.trakt-tab-view) {
      width: 100%;
    }
  }
</style>
