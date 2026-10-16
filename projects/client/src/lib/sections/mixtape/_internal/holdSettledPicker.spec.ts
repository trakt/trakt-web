import { describe, expect, it } from 'vitest';
import { holdSettledPicker } from './holdSettledPicker.ts';
import type { PickerItems } from './PickerItems.ts';

const pickerOf = (kind: PickerItems<number>['kind'], ids: number[]) => ({
  kind,
  items: ids.map((media) => ({ media, isOff: false })),
});

describe('util: holdSettledPicker', () => {
  const recent = pickerOf('recent', [1, 2, 3]);
  const shifted = pickerOf('fits', [2, 3]);
  const fits = pickerOf('fits', [4, 5]);

  it('should show the picker as is when nothing is loading', () => {
    const held = holdSettledPicker(null, {
      picker: recent,
      isSettling: false,
      isHistoryLoading: false,
    });

    expect(held).toEqual({ settled: recent, shown: recent });
  });

  it('should keep showing the settled picker while new fits load', () => {
    const settled = { settled: recent, shown: recent };

    const held = holdSettledPicker(settled, {
      picker: shifted,
      isSettling: true,
      isHistoryLoading: false,
    });

    expect(held.shown).toBe(recent);
  });

  it('should swap to the new picker once the fits land', () => {
    const settling = { settled: recent, shown: recent };

    const held = holdSettledPicker(settling, {
      picker: fits,
      isSettling: false,
      isHistoryLoading: false,
    });

    expect(held).toEqual({ settled: fits, shown: fits });
  });

  it('should show the incoming picker when nothing settled yet', () => {
    const held = holdSettledPicker(null, {
      picker: shifted,
      isSettling: true,
      isHistoryLoading: false,
    });

    expect(held.shown).toBe(shifted);
  });

  it('should not remember a picker built while the history loads', () => {
    const loading = holdSettledPicker(null, {
      picker: pickerOf('fits', []),
      isSettling: false,
      isHistoryLoading: true,
    });

    const held = holdSettledPicker(loading, {
      picker: shifted,
      isSettling: true,
      isHistoryLoading: false,
    });

    expect(loading.settled).toBeNull();
    expect(held.shown).toBe(shifted);
  });
});
