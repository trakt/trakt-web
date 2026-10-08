import { describe, expect, it } from 'vitest';
import { toPanelRoles } from './toPanelRoles.ts';

describe('util: toPanelRoles', () => {
  it('should settle the panels outside of advancing', () => {
    expect(toPanelRoles('guess')).toEqual(['known', 'mystery', 'upcoming']);
    expect(toPanelRoles('over')).toEqual(['known', 'mystery', 'upcoming']);
  });

  it('should shift every panel one step while advancing', () => {
    expect(toPanelRoles('advance')).toEqual(['leaving', 'known', 'mystery']);
  });
});
