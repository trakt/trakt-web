import { toVipUpsellSource } from '$lib/features/upsell/toVipUpsellSource.ts';

const YIR_EMAIL_SOURCE = 'yir-email';
const YIR_PATH_PATTERN = /^\/users\/[\w-]+\/year\/(?:\d{4}|all)$/;

export function toYirEmailReturnPath({
  searchParams,
}: Pick<URL, 'searchParams'>) {
  if (toVipUpsellSource(searchParams.get('source')) !== YIR_EMAIL_SOURCE) {
    return null;
  }

  const path = searchParams.get('return');

  return path && YIR_PATH_PATTERN.test(path) ? path : null;
}
