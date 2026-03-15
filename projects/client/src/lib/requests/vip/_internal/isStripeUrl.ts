const STRIPE_HOSTNAME = 'stripe.com';

export function isStripeUrl(value: string) {
  try {
    const { protocol, hostname } = new URL(value);
    return protocol === 'https:' &&
      (hostname === STRIPE_HOSTNAME ||
        hostname.endsWith(`.${STRIPE_HOSTNAME}`));
  } catch {
    return false;
  }
}
