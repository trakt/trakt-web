type ToVipBadgeLabelProps = {
  isDirector?: boolean;
  label?: string | Nil;
};

export function toVipBadgeLabel({
  isDirector = false,
  label,
}: ToVipBadgeLabelProps): string {
  if (isDirector) return 'DIRECTOR';

  return label ?? 'VIP';
}
