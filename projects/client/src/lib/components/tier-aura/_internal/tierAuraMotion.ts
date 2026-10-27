import type { Attachment } from 'svelte/attachments';
import type { TierAuraTier } from '../TierAuraTier.ts';
import { playAuraShine } from './playAuraShine.ts';

type TierAuraMotionParams = {
  tier: TierAuraTier;
  motion: 'live' | 'hover' | 'still';
};

/*
  A list holds its auras still and plays only the row under the pointer.
  The aura wakes on first hover (until then it carries no animations at
  all), plays while hovered, and pauses where it is when the pointer leaves.
*/
export function tierAuraMotion({
  tier,
  motion,
}: TierAuraMotionParams): Attachment<HTMLElement> {
  return (aura) => {
    if (motion !== 'hover') return;

    const row = aura.closest<HTMLElement>('[data-tier-aura-row]') ?? aura;
    const play = () => {
      aura.classList.add('is-awake', 'is-playing');
      playAuraShine(aura, tier);
    };
    const pause = () => aura.classList.remove('is-playing');

    row.addEventListener('pointerenter', play);
    row.addEventListener('pointerleave', pause);

    return () => {
      row.removeEventListener('pointerenter', play);
      row.removeEventListener('pointerleave', pause);
    };
  };
}
