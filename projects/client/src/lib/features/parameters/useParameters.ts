import { getContext, setContext } from 'svelte';
import { derived, type Writable, writable } from 'svelte/store';

export const PARAMETER_CONTEXT_KEY = Symbol('parameters');
export const PARAMETER_OVERRIDE_CONTEXT_KEY = Symbol('parameters_override');

type ParameterType = string | number;

export type ParameterContextData = {
  parameters: Writable<Map<string, ParameterType>>;
};

export function useParameters() {
  const { parameters } = setContext(
    PARAMETER_CONTEXT_KEY,
    getContext<ParameterContextData>(PARAMETER_CONTEXT_KEY) ?? {
      parameters: writable(new Map<string, ParameterType>()),
    },
  );

  const override = setContext(
    PARAMETER_OVERRIDE_CONTEXT_KEY,
    getContext<Writable<string>>(PARAMETER_OVERRIDE_CONTEXT_KEY) ??
      writable(''),
  );

  function update(params: Record<string, ParameterType>) {
    parameters.update((current) => {
      current.entries()
        .forEach(([key]) => {
          if (!(key in params)) {
            current.delete(key);
          }
        });
      return current;
    });

    for (const [key, value] of Object.entries(params)) {
      parameters.update((current) => {
        current.set(key, value);
        return current;
      });
    }
  }

  /**
   * Returns a reactive URLSearchParams object that updates when parameters change
   */
  const search = derived([parameters, override], ([$parameters, $override]) => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of $parameters.entries()) {
      if (key === $override) {
        continue;
      }
      searchParams.set(key, String(value));
    }

    return searchParams;
  });

  return {
    search,
    update,
  };
}
