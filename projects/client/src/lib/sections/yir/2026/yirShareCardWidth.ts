import type { ShareType } from '$lib/features/share/models/ShareType.ts';

const WIDTHS: Record<ShareType, number> = {
  'open-graph': 370,
  feed: 480,
  story: 860,
};

export function yirShareCardWidth(variant: ShareType): number {
  return WIDTHS[variant];
}
