import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';
import type { Observable } from 'rxjs';

export function spoiler(
  node: HTMLElement,
  isSpoilerHidden: Observable<boolean>,
) {
  const subscribe = (source: Observable<boolean>) =>
    source.subscribe((isHidden) => {
      node.classList.toggle(SPOILER_CLASS_NAME, isHidden);
    });

  let subscription = subscribe(isSpoilerHidden);

  return {
    update(source: Observable<boolean>) {
      subscription.unsubscribe();
      subscription = subscribe(source);
    },
    destroy() {
      subscription.unsubscribe();
      node.classList.remove(SPOILER_CLASS_NAME);
    },
  };
}
