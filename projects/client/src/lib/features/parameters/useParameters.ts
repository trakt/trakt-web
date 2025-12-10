import { BehaviorSubject, combineLatest, map } from 'rxjs';
import {
  createParameterContext,
  type ParameterType,
} from './_internal/createParameterContext.ts';

export type ParameterContextData = {
  parameters: BehaviorSubject<Map<string, ParameterType>>;
};

export function useParameters() {
  const { parameters, override, isEscaped } = createParameterContext();

  function update(params: Record<string, ParameterType>) {
    const current = new Map(parameters.value);

    // Remove keys not in params
    Array.from(current.keys())
      .forEach((key) => {
        if (!(key in params)) {
          current.delete(key);
        }
      });

    // Add/Update keys from params
    for (const [key, value] of Object.entries(params)) {
      current.set(key, value);
    }

    parameters.next(current);
  }

  /**
   * Returns a reactive URLSearchParams object that updates when parameters change
   */
  const search = combineLatest([parameters, override]).pipe(
    map(([paramsMap, overrideKey]) => {
      const searchParams = new URLSearchParams();
      for (const [key, value] of paramsMap.entries()) {
        if (key === overrideKey) {
          continue;
        }
        searchParams.set(key, String(value));
      }

      return searchParams;
    }),
  );

  return {
    search,
    update,
    override,
    isEscaped,
  };
}
