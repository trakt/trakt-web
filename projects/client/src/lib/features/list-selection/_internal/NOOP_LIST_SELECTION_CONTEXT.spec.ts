import { describe, expect, it } from 'vitest';
import { NOOP_LIST_SELECTION_CONTEXT } from './NOOP_LIST_SELECTION_CONTEXT.ts';

describe('util: NOOP_LIST_SELECTION_CONTEXT', () => {
  it('should report no active selection', () => {
    expect(NOOP_LIST_SELECTION_CONTEXT.isEditing).toBe(false);
    expect(NOOP_LIST_SELECTION_CONTEXT.selectedCount).toBe(0);
    expect(NOOP_LIST_SELECTION_CONTEXT.totalCount).toBe(0);
    expect(NOOP_LIST_SELECTION_CONTEXT.isSelected('anything')).toBe(false);
  });

  it('should tolerate every mutating call as a no-op', () => {
    expect(() => {
      NOOP_LIST_SELECTION_CONTEXT.enterEdit('a');
      NOOP_LIST_SELECTION_CONTEXT.click('a');
      NOOP_LIST_SELECTION_CONTEXT.selectAll();
      NOOP_LIST_SELECTION_CONTEXT.clearSelection();
      NOOP_LIST_SELECTION_CONTEXT.register({ key: 'a' } as never);
      NOOP_LIST_SELECTION_CONTEXT.unregister('a');
      NOOP_LIST_SELECTION_CONTEXT.exitEdit();
    }).not.toThrow();
  });
});
