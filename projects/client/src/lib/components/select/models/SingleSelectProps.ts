import type { Snippet } from 'svelte';
import type { SelectOption } from './SelectOption.ts';

export type SingleSelectProps = {
  options: ReadonlyArray<SelectOption>;
  value?: string | null;
  placeholder: string;
  disabled?: boolean;
  autoWidth?: boolean;
  onChange: (value: string) => void;
  trigger?: Snippet<[{ props: Record<string, unknown>; open: boolean }]>;
};
