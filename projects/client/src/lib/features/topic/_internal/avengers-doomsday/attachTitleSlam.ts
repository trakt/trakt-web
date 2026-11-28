import { attachAll } from '../shared/attachAll.ts';
import { prefersReducedMotion } from '../shared/prefersReducedMotion.ts';
import { letterMarkup } from './letterMarkup.ts';
import { slamTimings } from './slamTimings.ts';

const SLAMMING = 'doom-slamming';

const measureTypography = (from: HTMLElement) => {
  const style = getComputedStyle(from);

  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    textTransform: style.textTransform,
    textAlign: style.textAlign,
    left: `${from.offsetLeft}px`,
    top: `${from.offsetTop}px`,
    width: `${from.offsetWidth}px`,
    height: `${from.offsetHeight}px`,
  };
};

const copyTypography = (from: HTMLElement, to: HTMLElement) =>
  Object.assign(to.style, measureTypography(from));

const slam = (title: HTMLElement) => {
  const host = title.parentElement;
  const text = title.textContent?.trim() ?? '';
  if (!host || text.length === 0) return () => {};

  const overlay = document.createElement('span');
  overlay.className = 'doom-slam';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `${letterMarkup(text)}<span class="doom-slam-shock"></span>`;
  copyTypography(title, overlay);
  host.append(overlay);

  const sync = { frame: 0 };
  const follow = () => {
    copyTypography(title, overlay);
    sync.frame = requestAnimationFrame(follow);
  };
  sync.frame = requestAnimationFrame(follow);
  title.classList.add(SLAMMING);

  const { impactAt, endAt } = slamTimings(text);

  const timers = [
    setTimeout(() => overlay.classList.add('is-impact'), impactAt),
    setTimeout(() => {
      cancelAnimationFrame(sync.frame);
      title.classList.remove(SLAMMING);
      overlay.remove();
    }, endAt),
  ];

  return () => {
    cancelAnimationFrame(sync.frame);
    timers.forEach(clearTimeout);
    title.classList.remove(SLAMMING);
    overlay.remove();
  };
};

export function attachTitleSlam() {
  if (prefersReducedMotion()) return () => {};

  return attachAll({
    selector: '.trakt-summary-title h1',
    attach: (title) => {
      const state = { stop: slam(title), text: title.textContent };
      const observer = new MutationObserver(() => {
        if (title.textContent === state.text) return;
        state.text = title.textContent;
        state.stop();
        state.stop = slam(title);
      });
      observer.observe(title, {
        childList: true,
        characterData: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
        state.stop();
      };
    },
  });
}
