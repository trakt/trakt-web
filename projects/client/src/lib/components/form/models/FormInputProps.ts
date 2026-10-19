import type { HTMLInputAttributes } from 'svelte/elements';
import type { ValidationProps } from './ValidationProps.ts';

export type FormInputProps = {
  autofocus?: boolean;
  onChange: (value: string) => void;
  value?: string;
  disabled: boolean;
  placeholder: string;
  required?: boolean;
  validation?: ValidationProps;
  type?: 'text' | 'url' | 'password';
  autocomplete?: HTMLInputAttributes['autocomplete'];
};
