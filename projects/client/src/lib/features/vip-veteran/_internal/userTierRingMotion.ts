import type { Attachment } from 'svelte/attachments';
import type { UserTier } from '../UserTier.ts';
import { playUserTierShine } from './playUserTierShine.ts';

const INTERACTIVE = 'a[href], button, [role="button"]';

export function userTierRingMotion(tier: UserTier): Attachment<HTMLElement> {
  return (ring) => {
    const target =
      ring.closest<HTMLElement>(INTERACTIVE) ??
      ring.querySelector<HTMLElement>(INTERACTIVE);
    if (!target) return;

    const play = () => {
      ring.classList.add('is-awake', 'is-playing');
      playUserTierShine(ring, tier);
    };
    const pause = () => ring.classList.remove('is-playing');

    target.addEventListener('pointerenter', play);
    target.addEventListener('pointerleave', pause);

    return () => {
      target.removeEventListener('pointerenter', play);
      target.removeEventListener('pointerleave', pause);
    };
  };
}
