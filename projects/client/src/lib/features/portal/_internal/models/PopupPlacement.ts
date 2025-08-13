export type PopupPosition = 'top' | 'bottom' | 'left' | 'right';

export type PopupPlacement = {
  position: PopupPosition;
  mode?: 'default' | 'contain';
};
