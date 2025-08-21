import { derived, type Writable } from 'svelte/store';
import {
  createParameterContext,
  type ParameterType,
} from './_internal/createParameterContext.ts';

export type ParameterContextData = {
  parameters: Writable<Map<string, ParameterType>>;
};

export function useParameters() {
  const { parameters, override, isEscaped } = createParameterContext();

  function update(params: Record<string, ParameterType>) {
    parameters.update((current) => {
      Array.from(current.entries())
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
    override,
    isEscaped,
  };
}
