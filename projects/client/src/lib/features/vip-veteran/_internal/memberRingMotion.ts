import type { Attachment } from 'svelte/attachments';
import type { MemberTier } from '../MemberTier.ts';
import { playMemberShine } from './playMemberShine.ts';

type MemberRingMotionParams = {
  tier: MemberTier;
  motion: 'live' | 'hover' | 'still';
};

/*
  A list holds its rings still and plays only the row under the pointer.
  A ring wakes on first hover (until then it carries no animations at all),
  plays while hovered, and pauses where it is when the pointer leaves.
*/
export function memberRingMotion({
  tier,
  motion,
}: MemberRingMotionParams): Attachment<HTMLElement> {
  return (ring) => {
    if (motion !== 'hover') return;

    const row = ring.closest<HTMLElement>('[data-member-row]') ?? ring;
    const play = () => {
      ring.classList.add('is-awake', 'is-playing');
      playMemberShine(ring, tier);
    };
    const pause = () => ring.classList.remove('is-playing');

    row.addEventListener('pointerenter', play);
    row.addEventListener('pointerleave', pause);

    return () => {
      row.removeEventListener('pointerenter', play);
      row.removeEventListener('pointerleave', pause);
    };
  };
}
