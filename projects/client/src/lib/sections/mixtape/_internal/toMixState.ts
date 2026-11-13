export type MixState = 'empty' | 'picking' | 'ready' | 'mixing' | 'done';

type MixStateParams = {
  count: number;
  max: number;
  view: 'pick' | 'results';
  isMixing: boolean;
};

export function toMixState({
  count,
  max,
  view,
  isMixing,
}: MixStateParams): MixState {
  if (isMixing) return 'mixing';
  if (view === 'results') return 'done';
  if (count === 0) return 'empty';
  if (count >= max) return 'ready';
  return 'picking';
}
