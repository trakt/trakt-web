import { attachDecoration } from '../shared/attachDecoration.ts';
import { detachAll } from '../shared/detachAll.ts';

const SELECTOR = '.trakt-summary-poster-container[data-variant]';

export function attachMonolith() {
  return detachAll([
    attachDecoration({
      selector: SELECTOR,
      className: 'dn3-monolith',
      prepend: true,
    }),
  ]);
}
