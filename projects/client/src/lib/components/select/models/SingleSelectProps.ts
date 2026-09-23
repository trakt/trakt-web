import type { Snippet } from 'svelte';
import type { SelectOption } from './SelectOption.ts';

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
  onChange: (value: string) => void;
} & (CustomTriggerProps | DefaultTriggerProps);
