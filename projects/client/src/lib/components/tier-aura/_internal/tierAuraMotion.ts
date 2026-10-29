import type { Attachment } from 'svelte/attachments';
import type { TierAuraTier } from '../TierAuraTier.ts';
import { playAuraShine } from './playAuraShine.ts';

const visibility = new Map<string, IntersectionObserver>();

function observeVisibility(aura: HTMLElement) {
  const observer =
    visibility.get('live') ??
    new IntersectionObserver((entries) => {
      entries.forEach((entry) =>
        entry.target.classList.toggle('is-offscreen', !entry.isIntersecting),
      );
    });
  visibility.set('live', observer);
  observer.observe(aura);

  return () => observer.unobserve(aura);
}

type TierAuraMotionParams = {
  tier: TierAuraTier;
  motion: 'live' | 'hover' | 'still';
};

export function tierAuraMotion({
  tier,
  motion,
}: TierAuraMotionParams): Attachment<HTMLElement> {
  return (aura) => {
    if (motion === 'still') return;

    const row = aura.closest<HTMLElement>('[data-tier-aura-row]') ?? aura;
    const play = () => {
      if (motion === 'hover') aura.classList.add('is-awake', 'is-playing');
      playAuraShine(aura, tier);
    };
    const pause = () => aura.classList.remove('is-playing');

    row.addEventListener('pointerenter', play);
    row.addEventListener('pointerleave', pause);
    const unobserve = motion === 'live' ? observeVisibility(aura) : null;

    return () => {
      row.removeEventListener('pointerenter', play);
      row.removeEventListener('pointerleave', pause);
      unobserve?.();
    };
  };
}
