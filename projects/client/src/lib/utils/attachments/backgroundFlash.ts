import type { Attachment } from 'svelte/attachments';

export type BackgroundFlash = { color: 'purple' | 'red' };

const FLASH_ANIMATION = 'background-flash';

function isFlashAnimation(animation: Animation) {
  return 'animationName' in animation &&
    animation.animationName === FLASH_ANIMATION;
}

export function backgroundFlash(
  flash: BackgroundFlash | Nil,
): Attachment<HTMLElement> {
  return (node) => {
    if (!flash) {
      delete node.dataset.backgroundFlash;
      return;
    }

    const clear = (event: AnimationEvent) => {
      if (event.animationName !== FLASH_ANIMATION) {
        return;
      }

      delete node.dataset.backgroundFlash;
    };

    node.addEventListener('animationend', clear);
    node.dataset.backgroundFlash = flash.color;

    node.getAnimations?.({ subtree: true })
      .filter(isFlashAnimation)
      .forEach((animation) => {
        animation.currentTime = 0;
      });

    return () => node.removeEventListener('animationend', clear);
  };
}
