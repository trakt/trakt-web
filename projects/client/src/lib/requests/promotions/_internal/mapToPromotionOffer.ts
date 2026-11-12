import type { PromotionOffer } from '$lib/requests/models/PromotionOffer.ts';
import type { PromotionResponse } from '$lib/requests/models/PromotionResponse.ts';

export function mapToPromotionOffer(
  response: PromotionResponse,
): PromotionOffer {
  return {
    id: response.id,
    name: response.name,
    label: response.label,
    theme: response.theme,
    startsAt: new Date(response.starts_at),
    endsAt: new Date(response.ends_at),
    plan: {
      duration: response.plan.duration,
      currency: response.plan.currency,
      fullPrice: response.plan.amount,
      discountedPrice: response.plan.discounted_amount,
      amountOff: response.plan.amount_off,
      monthsInTerm: response.plan.months_in_term,
      firstTermOnly: response.plan.first_term_only,
    },
  };
}
