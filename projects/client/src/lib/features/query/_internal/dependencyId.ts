import type { Dependency } from '../models/Dependency.ts';

const DEPENDENCY_ID = 'dependency';

export function dependencyId(key: Dependency) {
  return `${DEPENDENCY_ID}:${key}`;
}
