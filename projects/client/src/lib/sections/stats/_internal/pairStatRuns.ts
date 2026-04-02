import type { PulseItem } from '../models/PulseItem.ts';

type Acc = {
  readonly result: ReadonlyArray<PulseItem>;
  readonly carry: ReadonlyArray<PulseItem>;
};

/*
  We pair the items so they can always be screen filling to achieve a no-scroll layout.
*/
export function pairStatRuns(
  items: ReadonlyArray<PulseItem>,
): PulseItem[] {
  const { result, carry } = items.reduce<Acc>(
    ({ result, carry }, item) => {
      if (item.type === 'stat') {
        return { result, carry: [...carry, item] };
      }

      const hasOddStats = carry.length % 2 === 1;

      return {
        result: [
          ...result,
          ...(hasOddStats ? carry.slice(0, -1) : carry),
          item,
        ],
        carry: hasOddStats ? carry.slice(-1) : [],
      };
    },
    { result: [], carry: [] },
  );

  return [...result, ...carry];
}
