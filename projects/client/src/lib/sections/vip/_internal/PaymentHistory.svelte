<script lang="ts">
  import ArrowLeftIcon from "$lib/components/icons/ArrowLeftIcon.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import { getLocale, languageTag } from "$lib/features/i18n";
  import { m } from "$lib/features/i18n/messages";
  import { type VipTransaction } from "$lib/requests/models/VipTransaction";
  import { toHumanCurrency } from "$lib/utils/formatting/currency/toHumanCurrency";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay";
  import CreditCardIcon from "./icons/CreditCardIcon.svelte";
  import CrownIcon from "./icons/CrownIcon.svelte";
  import SyncIcon from "./icons/SyncIcon.svelte";
  import { toPaymentMethodLabel } from "./utils/toPaymentMethodLabel";
  import { toVipDurationLabel } from "./utils/toVipDurationLabel";

  const { transactions }: { transactions: VipTransaction[] } = $props();

  function iconFor(type: VipTransaction["type"]) {
    switch (type) {
      case "payment":
        return CreditCardIcon;
      case "create":
        return CrownIcon;
      case "cancel":
        return CloseIcon;
      case "refund":
        return ArrowLeftIcon;
      case "dispute":
        return InfoIcon;
      case "plan_change":
        return SyncIcon;
      default:
        return SparkleIcon;
    }
  }

  function amountFor(transaction: VipTransaction): string | null {
    if (transaction.amount == null || !transaction.currency) {
      return null;
    }

    const price = Number(transaction.amount);
    if (Number.isNaN(price)) {
      return null;
    }

    return toHumanCurrency({
      price,
      currency: transaction.currency,
      locale: languageTag(),
    });
  }

  function dateTimeFor(transaction: VipTransaction): string {
    return toHumanDay({
      date: transaction.createdAt,
      locale: getLocale(),
      format: "short-with-time",
    });
  }

  function descriptionFor(transaction: VipTransaction): string {
    const method = toPaymentMethodLabel(transaction.gateway);
    const amount = amountFor(transaction);
    const term = toVipDurationLabel(transaction.vipType);

    switch (transaction.type) {
      case "payment":
        return amount && term
          ? m.text_vip_transaction_charged({ amount, method, term })
          : m.text_vip_transaction_charged_short({
              amount: amount ?? "",
              method,
            });
      case "refund":
        return m.text_vip_transaction_refunded({
          amount: amount ?? "",
          method,
        });
      case "create":
        return m.text_vip_transaction_created({ method });
      case "cancel":
        return m.text_vip_transaction_cancelled({ method });
      case "dispute":
        return m.text_vip_transaction_disputed({ method });
      case "plan_change":
        return m.text_vip_transaction_plan_changed({ method });
      default:
        return m.text_vip_transaction_complimentary();
    }
  }
</script>

<div class="trakt-vip-payment-history">
  {#each transactions as transaction (transaction.id)}
    {@const Icon = iconFor(transaction.type)}
    <div class="history-row">
      <div class="history-row-icon">
        <Icon />
      </div>

      <div class="history-row-detail">
        <span class="history-row-time secondary small">
          {dateTimeFor(transaction)}
        </span>
        <span class="history-row-desc">
          <MessageWithBold message={descriptionFor(transaction)} />
        </span>
      </div>
    </div>
  {/each}
</div>

<style>
  .trakt-vip-payment-history {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .history-row {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
  }

  .history-row-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    width: var(--ni-36);
    height: var(--ni-36);

    background: color-mix(in srgb, var(--color-text-primary) 5%, transparent);

    border-radius: var(--border-radius-m);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-text-primary) 10%, transparent);

    :global(svg) {
      color: var(--color-text-secondary);

      width: var(--ni-20);
      height: var(--ni-20);
    }
  }

  .history-row-detail {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
  }

  .history-row-time {
    line-height: 1.3;
  }

  .history-row-desc {
    line-height: 1.3;
  }
</style>
