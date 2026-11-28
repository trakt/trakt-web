import { attachAll } from '../shared/attachAll.ts';
import { lockupMarkup } from './lockupMarkup.ts';

const SOURCE_CLASS = 'dd-lockup-source';

export function attachLockups() {
  return attachAll({
    selector:
      '.trakt-list-title-wrapper > .title, .trakt-calendar-week .week-title',
    attach: (source) => {
      const lockup = document.createElement('span');
      lockup.className = 'dd-lockup';
      lockup.setAttribute('aria-hidden', 'true');

      const render = () => {
        lockup.innerHTML = lockupMarkup(source.textContent ?? '');
      };

      render();
      source.classList.add(SOURCE_CLASS);
      source.after(lockup);

      const observer = new MutationObserver(render);
      observer.observe(source, {
        characterData: true,
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
        lockup.remove();
        source.classList.remove(SOURCE_CLASS);
      };
    },
  });
}
