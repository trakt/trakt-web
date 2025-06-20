import { assertDefined } from './assertDefined.ts';

export function firstItem<T>(items: T[]): T {
  return assertDefined(items[0], 'Expected at least one result');
}
