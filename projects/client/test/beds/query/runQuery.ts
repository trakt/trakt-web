import { render } from '@testing-library/svelte';
import type { Observable } from 'rxjs';
import QueryTestBed from './QueryTestBed.svelte';

type RunQueryProps<T> = {
  factory: () => Observable<T>;
  mapper?: (response: T) => unknown;
  waitFor?: (response: T) => boolean;
};

export function runQuery<T>({
  factory,
  mapper,
  waitFor,
}: RunQueryProps<T>): Promise<T> {
  return new Promise((resolve) =>
    render(QueryTestBed, {
      props: {
        factory,
        mapper,
        waitFor,
        output: (value: unknown) => resolve(value as T),
      },
    })
  );
}
