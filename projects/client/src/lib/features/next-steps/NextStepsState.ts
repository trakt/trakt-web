import type { NextStepsPage } from './NextStepsPage.ts';

export type NextStepsState =
  | { status: 'loading' }
  | { status: 'visible'; page: NextStepsPage }
  | { status: 'hidden' };
