import { afterNavigate } from '$app/navigation';
import { page } from '$app/state';
import { BehaviorSubject } from 'rxjs';
import { getContext, setContext } from 'svelte';
import type { ParameterContextData } from '../useParameters.ts';

export type ParameterType = string | number | boolean;
export const PARAMETER_CONTEXT_KEY = Symbol('parameters');
export const PARAMETER_SETTER_CONTEXT_KEY = Symbol('parameters_setter');
export const PARAMETER_ESCAPE_KEY = Symbol('parameters_escape');

export function createParameterContext() {
  const params = new BehaviorSubject(page.params);
  const search = new BehaviorSubject(page.url.searchParams);
  const url = new BehaviorSubject(page.url);

  afterNavigate(() => {
    params.next(page.params);
    search.next(page.url.searchParams);
    url.next(page.url);
  });

  const ctx = setContext(
    PARAMETER_CONTEXT_KEY,
    getContext<ParameterContextData>(PARAMETER_CONTEXT_KEY) ??
      {
        parameters: new BehaviorSubject(new Map<string, ParameterType>()),
      },
  );

  const override = setContext(
    PARAMETER_SETTER_CONTEXT_KEY,
    getContext<BehaviorSubject<string>>(PARAMETER_SETTER_CONTEXT_KEY) ??
      new BehaviorSubject(''),
  );

  const isEscaped = setContext(
    PARAMETER_ESCAPE_KEY,
    getContext<BehaviorSubject<boolean>>(PARAMETER_ESCAPE_KEY) ??
      new BehaviorSubject(false),
  );

  return { ...ctx, override, isEscaped };
}
