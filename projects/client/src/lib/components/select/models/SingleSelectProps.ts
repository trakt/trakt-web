import type { SelectOption } from './SelectOption.ts';

export type SingleSelectProps = {
  options: ReadonlyArray<SelectOption>;
  value?: string | null;
  placeholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};
