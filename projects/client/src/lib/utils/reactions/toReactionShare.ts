import { toPercentage } from '$lib/utils/formatting/number/toPercentage.ts';

type ToReactionShareParams = {
  count: number;
  total: number;
  locale: string;
};

export function toReactionShare(
  { count, total, locale }: ToReactionShareParams,
): string {
  if (total <= 0 || count <= 0) return toPercentage(0, locale);

  const share = count / total;
  if (share < 0.005) return `<${toPercentage(0.01, locale)}`;

  return toPercentage(share, locale);
}
