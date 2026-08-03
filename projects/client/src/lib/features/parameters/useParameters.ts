import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
} from 'rxjs';
import {
  createParameterContext,
  type ParameterType,
} from './_internal/createParameterContext.ts';

export type ParameterContextData = {
  parameters: BehaviorSubject<Map<string, ParameterType>>;
  url: BehaviorSubject<URL>;
};

export function useParameters() {
  const { parameters, url, override, isEscaped } = createParameterContext();

  function update(params: Record<string, ParameterType>) {
    const current = parameters.value;

    Array.from(current.entries())
      .forEach(([key]) => {
        if (!(key in params)) {
          current.delete(key);
        }
      });

    for (const [key, value] of Object.entries(params)) {
      current.set(key, value);
    }

    parameters.next(current);
  }

  /**
   * Returns a reactive URLSearchParams object that updates when parameters change
   */
  const search = combineLatest([parameters, override]).pipe(
    map(([$parameters, $override]: [Map<string, ParameterType>, string]) => {
      const searchParams = new URLSearchParams();
      for (const [key, value] of $parameters.entries()) {
        if (key === $override) {
          continue;
        }
        searchParams.set(key, String(value));
      }

      return searchParams;
    }),
    distinctUntilChanged((a, b) => a.toString() === b.toString()),
  );

  return {
    search,
    update,
    override,
    isEscaped,
    url: url.asObservable(),
    setUrl: (next: URL) => url.next(next),
  };
}
