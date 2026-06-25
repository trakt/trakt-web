import { m } from '$lib/features/i18n/messages.ts';
import type { VipGateway } from '$lib/requests/models/VipGateway.ts';

export function toPaymentMethodLabel(gateway: VipGateway | Nil): string {
  switch (gateway) {
    case 'stripe':
      return m.text_vip_payment_method_card();
    case 'paypal':
    case 'paypal_api':
      return m.text_vip_payment_method_paypal();
    case 'apple':
      return m.text_vip_payment_method_apple();
    case 'google':
      return m.text_vip_payment_method_google();
    default:
      return m.text_vip_payment_method_other();
  }
}
