type ToVipBadgeLabelProps = {
  isDirector?: boolean;
};

export function toVipBadgeLabel({
  isDirector = false,
}: ToVipBadgeLabelProps): string {
  return isDirector ? 'DIRECTOR' : 'VIP';
}
