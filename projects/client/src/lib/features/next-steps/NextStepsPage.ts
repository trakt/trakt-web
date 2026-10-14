import type { NextStep } from './NextStep.ts';

export type NextStepsPage = {
  steps: ReadonlyArray<NextStep>;
  completed: number;
  total: number;
};
