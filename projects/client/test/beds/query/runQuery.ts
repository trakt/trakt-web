import { render } from '@testing-library/svelte';
import type { Readable } from 'svelte/store';
import QueryTestBed from './QueryTestBed.svelte';

type RunQueryProps<T> = {
  factory: () => Readable<T>;
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
        output: (value) => resolve(value as T),
      },
    })
  );
}
