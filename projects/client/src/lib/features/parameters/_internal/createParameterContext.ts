import { getContext, setContext } from 'svelte';
import { type Writable, writable } from 'svelte/store';
import type { ParameterContextData } from '../useParameters.ts';

export type ParameterType = string | number;
export const PARAMETER_CONTEXT_KEY = Symbol('parameters');
export const PARAMETER_SETTER_CONTEXT_KEY = Symbol('parameters_setter');
export const PARAMETER_ESCAPE_KEY = Symbol('parameters_escape');

export function createParameterContext() {
  const ctx = setContext(
    PARAMETER_CONTEXT_KEY,
    getContext<ParameterContextData>(PARAMETER_CONTEXT_KEY) ??
      {
        parameters: writable(new Map<string, ParameterType>()),
      },
  );

  const override = setContext(
    PARAMETER_SETTER_CONTEXT_KEY,
    getContext<Writable<string>>(PARAMETER_SETTER_CONTEXT_KEY) ??
      writable(''),
  );

  const isEscaped = setContext(
    PARAMETER_ESCAPE_KEY,
    getContext<Writable<boolean>>(PARAMETER_ESCAPE_KEY) ?? writable(false),
  );

  return { ...ctx, override, isEscaped };
}
