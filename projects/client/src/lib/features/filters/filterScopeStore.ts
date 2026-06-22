import { BehaviorSubject } from 'rxjs';

export type FilterScopeValue = Record<string, string> | null;

export const filterScopeStore = new BehaviorSubject<FilterScopeValue>(null);

type ScopeEntry = {
  token: symbol;
  value: FilterScopeValue;
};

// A stack so overlapping lifecycles (navigation transitions, nesting) restore
// the previous scope instead of wiping it when an inner/older scope releases.
const scopes: ScopeEntry[] = [];

export function acquireFilterScope(value: FilterScopeValue): symbol {
  const token = Symbol();
  scopes.push({ token, value });
  filterScopeStore.next(value);
  return token;
}

export function releaseFilterScope(token: symbol): void {
  const index = scopes.findIndex((scope) => scope.token === token);
  if (index === -1) return;

  scopes.splice(index, 1);
  const active = scopes.at(-1);
  filterScopeStore.next(active?.value ?? null);
}
