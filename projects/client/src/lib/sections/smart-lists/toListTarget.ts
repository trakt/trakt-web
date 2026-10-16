import { ListTarget } from './models/ListTarget.ts';

export function toListTarget(source: string | Nil): ListTarget | undefined {
  return Object.values(ListTarget).find((target) => target === source);
}
