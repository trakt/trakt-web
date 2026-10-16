import type { ListTarget } from './models/ListTarget.ts';
import { toListTarget } from './toListTarget.ts';

type SmartListTemplateParams = {
  name?: string;
  target?: ListTarget;
};

export function fromSmartListTemplateParams(
  params: URLSearchParams,
): SmartListTemplateParams {
  return {
    name: params.get('name')?.trim() || undefined,
    target: toListTarget(params.get('source')),
  };
}
