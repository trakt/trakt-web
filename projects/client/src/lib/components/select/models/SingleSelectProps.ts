import type { Snippet } from 'svelte';
import type { SelectOption } from './SelectOption.ts';
import type { SelectTriggerVariant } from './SelectTriggerVariant.ts';

type CustomTriggerProps = {
  trigger: Snippet<[{ props: Record<string, unknown>; open: boolean }]>;
  icon?: never;
};

type DefaultTriggerProps = {
  trigger?: never;
  icon?: Snippet;
};

export type SingleSelectProps = {
  options: ReadonlyArray<SelectOption>;
  value?: string | null;
  placeholder: string;
  disabled?: boolean;
  autoWidth?: boolean;
  variant?: SelectTriggerVariant;
  onChange: (value: string) => void;
} & (CustomTriggerProps | DefaultTriggerProps);
