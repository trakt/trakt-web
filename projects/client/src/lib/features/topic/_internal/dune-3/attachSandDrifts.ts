import { attachAll } from '../shared/attachAll.ts';
import { detachAll } from '../shared/detachAll.ts';
import { injectDecoration } from '../shared/injectDecoration.ts';

const SHAPES = 4;
const GRAINS = '<i></i><i></i><i></i><i></i><i></i><i></i>';

const footerOf = (cover: HTMLElement) =>
  cover
    .closest('.trakt-card-content')
    ?.querySelector<HTMLElement>(':scope > .trakt-card-footer');

const driftUnder = (cover: HTMLElement, index: number) => {
  const footer = footerOf(cover);
  if (!footer) return;
  const drift = document.createElement('span');
  drift.className = 'dn3-drift';
  drift.dataset.shape = String(index % SHAPES);
  drift.setAttribute('aria-hidden', 'true');
  drift.innerHTML = GRAINS;
  footer.append(drift);
  return () => drift.remove();
};

export function attachSandDrifts() {
  const counter = { next: 0 };

  return attachAll({
    selector: '.trakt-card-cover, .trakt-calendar-poster-tile .tile-poster',
    attach: (cover) => {
      const index = counter.next++;
      return detachAll([
        injectDecoration({ host: cover, className: 'dn3-dust' }),
        driftUnder(cover, index),
      ]);
    },
  });
}
