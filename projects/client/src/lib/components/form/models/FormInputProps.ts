import type { ValidationProps } from './ValidationProps.ts';

export type FormInputProps = {
  autofocus?: boolean;
  onChange: (value: string) => void;
  value?: string;
  disabled: boolean;
  placeholder: string;
  validation?: ValidationProps;
};
