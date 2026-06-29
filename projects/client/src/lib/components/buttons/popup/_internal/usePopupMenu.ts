import { usePortal } from '$lib/features/portal/usePortal.ts';
import { NOOP_FN } from '$lib/utils/constants.ts';
import { BehaviorSubject } from 'rxjs';

type UsePopupMenuProps = {
  variant: 'portal' | 'drawer';
};

export function usePopupMenu({ variant }: UsePopupMenuProps) {
  if (variant === 'portal') {
    const { portalTrigger, ...rest } = usePortal();

    return {
      menuTrigger: portalTrigger,
      ...rest,
    };
  }

  const isOpened = new BehaviorSubject(false);

  const openMenu = () => {
    isOpened.next(true);
  };

  const menuTrigger = (targetNode: HTMLElement) => {
    targetNode.addEventListener('click', openMenu);

    return {
      destroy() {
        targetNode.removeEventListener('click', openMenu);
      },
    };
  };

  return {
    menuTrigger,
    portal: NOOP_FN,
    isOpened: isOpened.asObservable(),
    close: () => {
      isOpened.next(false);
    },
  };
}
