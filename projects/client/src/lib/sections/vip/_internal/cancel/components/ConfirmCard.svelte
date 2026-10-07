<script lang="ts">
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toHumanLongDate } from "$lib/utils/formatting/date/toHumanLongDate.ts";
  import type { ConfirmCardProps } from "./ConfirmCardProps.ts";
  import DeckCard from "./DeckCard.svelte";
  import DeckCardHeading from "./DeckCardHeading.svelte";
  import LossRows from "./LossRows.svelte";
  import OfferCoupon from "./OfferCoupon.svelte";
  import VipCancelButton from "./VipCancelButton.svelte";

  const {
    position,
    total,
    summary,
    reason,
    onCancel,
    onKeep,
    onClaim,
    isBusy,
  }: ConfirmCardProps = $props();

  const offer = $derived(summary.offer);
  const isStripe = $derived(summary.gateway === "stripe");

  const facts = $derived([
    {
      key: "until",
      label: m.text_vip_cancel_fact_until(),
      value: toHumanLongDate(summary.endsAt, languageTag()),
    },
    {
      key: "data",
      label: m.text_vip_cancel_fact_data(),
      value: m.text_vip_cancel_fact_all_kept(),
    },
  ]);
</script>

<DeckCard tone="default" {position} step={{ current: total, total }}>
  {#snippet copy()}
    <DeckCardHeading
      eyebrow={m.tag_text_vip_cancel_confirm()}
      title={m.header_vip_cancel_confirm()}
    />
    <dl class="trakt-vip-cancel-facts">
      {#each facts as fact (fact.key)}
        <div class="fact">
          <dt class="fact-label small">{fact.label}</dt>
          <dd class="fact-value bold">{fact.value}</dd>
        </div>
      {/each}
    </dl>
  {/snippet}

  {#snippet visual()}
    <LossRows
      losses={summary.losses}
      endsAt={summary.endsAt}
      isActive={position === 0}
    />
    {#if offer}
      <OfferCoupon
        {offer}
        {reason}
        startsAt={summary.endsAt}
        {onClaim}
        {isBusy}
        isActive={position === 0}
      />
    {/if}
  {/snippet}

  {#snippet actions()}
    <div class="trakt-vip-cancel-confirm-actions">
      {#if offer}
        <VipCancelButton
          look="primary"
          label={m.button_label_vip_cancel_claim()}
          onclick={onClaim}
          disabled={isBusy}
        >
          {m.button_text_vip_cancel_claim_short()}
        </VipCancelButton>
      {:else}
        <VipCancelButton
          look="primary"
          label={m.button_label_vip_cancel_keep()}
          onclick={onKeep}
        >
          {m.button_text_vip_cancel_keep()}
        </VipCancelButton>
      {/if}
      {#if isStripe}
        <VipCancelButton
          look="secondary"
          label={m.button_label_vip_cancel_confirm()}
          onclick={onCancel}
          disabled={isBusy}
        >
          {m.button_text_vip_cancel_confirm()}
        </VipCancelButton>
      {:else if summary.manageUrl}
        <VipCancelButton
          look="secondary"
          label={m.button_label_vip_cancel_confirm()}
          href={summary.manageUrl}
          target="_blank"
        >
          {m.button_text_vip_cancel_confirm()}
        </VipCancelButton>
      {/if}
    </div>
  {/snippet}
</DeckCard>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-cancel-facts {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ni-16) var(--ni-22);
    margin: var(--ni-24) 0 0;

    @container vip-cancel (max-width: 760px) {
      margin-block-start: var(--ni-12);
      gap: var(--ni-10) var(--ni-16);
    }
  }

  .fact {
    display: grid;
    gap: var(--gap-xxs);
  }

  .fact-label {
    color: var(--deck-card-muted);
  }

  .fact-value {
    margin: 0;
    font-size: var(--ni-22);
    line-height: 1.1;
    letter-spacing: -0.02em;

    @container vip-cancel (max-width: 760px) {
      font-size: var(--ni-16);
    }
  }

  .trakt-vip-cancel-confirm-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--gap-s);
    width: min(100%, var(--ni-380));

    :global(.trakt-button) {
      justify-content: center;
    }

    @container vip-cancel (max-width: 760px) {
      width: 100%;
    }
  }

</style>
