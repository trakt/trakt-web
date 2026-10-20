import { SPOILER_CLASS_NAME } from '$lib/features/spoilers/constants.ts';

type SpoilMeAnywayOptions = {
  isDismissible?: boolean;
  onReveal?: () => void;
};

const revealedEvents = new WeakSet<Event>();

export function spoilMeAnyway(
  node: HTMLElement,
  options: SpoilMeAnywayOptions = {},
) {
  let { isDismissible = true, onReveal } = options;

  function handleClick(e: MouseEvent) {
    if (!isDismissible || !(e.target instanceof HTMLElement)) {
      return;
    }

    const { target } = e;
    const isHidden =
      node.classList.contains(SPOILER_CLASS_NAME) ||
      target.classList.contains(SPOILER_CLASS_NAME);

    if (!isHidden) {
      return;
    }

    e.preventDefault();

    node.classList.remove(SPOILER_CLASS_NAME);
    target.classList.remove(SPOILER_CLASS_NAME);

    if (!onReveal || revealedEvents.has(e)) {
      return;
    }

    revealedEvents.add(e);
    onReveal();
  }

  node.addEventListener('click', handleClick);

  return {
    update(next: SpoilMeAnywayOptions = {}) {
      ({ isDismissible = true, onReveal } = next);
    },
    destroy() {
      node.removeEventListener('click', handleClick);
    },
  };
}
