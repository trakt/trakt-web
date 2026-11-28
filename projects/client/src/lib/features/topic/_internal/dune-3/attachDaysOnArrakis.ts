import { m } from '$lib/features/i18n/messages.ts';
import { attachAll } from '../shared/attachAll.ts';
import { attachDecoration } from '../shared/attachDecoration.ts';
import { detachAll } from '../shared/detachAll.ts';
import { injectDecoration } from '../shared/injectDecoration.ts';
import { sunMoonsGlyph } from './sunMoonsGlyph.ts';

const readCount = (callout: HTMLElement) =>
  Number.parseInt(
    callout.querySelector('.trakt-streak-count')?.textContent ?? '',
    10,
  ) || 0;

const labelMarkup = (count: number) =>
  `<b>${count}</b><span>${count === 1 ? m.text_topic_dune_days_on_arrakis_one() : m.text_topic_dune_days_on_arrakis_other()}</span>`;

const relabel = (callout: HTMLElement) => {
  const info = callout.querySelector<HTMLElement>('.trakt-streak-info');
  const title = callout.querySelector<HTMLElement>('.trakt-streak-title');
  if (!info || !title) return;

  const remove = injectDecoration({
    host: info,
    className: 'dn3-arrakis-days',
    markup: labelMarkup(readCount(callout)),
  });
  const label = info.querySelector<HTMLElement>(':scope > .dn3-arrakis-days');
  const observer = new MutationObserver(() => {
    if (label) label.innerHTML = labelMarkup(readCount(callout));
  });
  observer.observe(title, {
    subtree: true,
    characterData: true,
    childList: true,
  });

  return () => {
    observer.disconnect();
    remove();
  };
};

export function attachDaysOnArrakis() {
  return detachAll([
    attachAll({ selector: '.trakt-streak-callout', attach: relabel }),
    attachDecoration({
      selector: '.trakt-streak-flame',
      className: 'dn3-arrakis-sun',
      markup: sunMoonsGlyph(),
    }),
  ]);
}
