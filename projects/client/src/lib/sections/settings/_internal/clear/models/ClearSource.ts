import type { ClearDataInput } from './ClearDataInput.ts';

export type ClearSource = DistributivePartial<
  ClearDataInput,
  'input'
>;
