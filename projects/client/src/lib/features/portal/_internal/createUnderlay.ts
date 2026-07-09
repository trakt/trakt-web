import { PORTAL_UNDERLAY_ID } from './constants.ts';

type CreateUnderlayOptions = {
  // Raise the underlay above a base-layer drawer so a stacked drawer's
  // outside-tap target sits on top of the drawer beneath it.
  elevated?: boolean;
};

export const createUnderlay = ({ elevated }: CreateUnderlayOptions = {}) => {
  const underlay = document.createElement('div');

  underlay.id = PORTAL_UNDERLAY_ID;

  underlay.style.position = 'fixed';
  underlay.style.top = '0';
  underlay.style.left = '0';
  underlay.style.width = '100%';
  underlay.style.height = '100%';

  underlay.style.zIndex = elevated
    ? 'calc(var(--layer-menu) + 2)'
    : 'calc(var(--layer-menu) - 1)';

  return underlay;
};
