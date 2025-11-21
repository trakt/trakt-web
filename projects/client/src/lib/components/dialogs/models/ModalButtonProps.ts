import type { TraktButtonProps } from '../../buttons/TraktButtonProps.ts';

export type ModalButtonProps = {
  text: string;
  label: string;
} & Pick<TraktButtonProps, 'variant' | 'color' | 'style' | 'disabled'>;
