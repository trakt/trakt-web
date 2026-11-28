import { m } from '$lib/features/i18n/messages.ts';
import { describe, expect, it } from 'vitest';
import { sideVerdict } from './sideVerdict.ts';

describe('util: sideVerdict', () => {
  it('should pick the dune verdict from 58 percent up', () => {
    expect(sideVerdict(58)).toEqual({
      side: 'dune',
      title: m.text_topic_dunesday_team_dune(),
      line: m.text_topic_dunesday_verdict_dune(),
    });
    expect(sideVerdict(92).side).toBe('dune');
  });

  it('should pick the doom verdict up to 42 percent', () => {
    expect(sideVerdict(42)).toEqual({
      side: 'doom',
      title: m.text_topic_dunesday_team_doom(),
      line: m.text_topic_dunesday_verdict_doom(),
    });
    expect(sideVerdict(8).side).toBe('doom');
  });

  it('should pick the double feature verdict in between', () => {
    expect(sideVerdict(43)).toEqual({
      side: 'double',
      title: m.text_topic_dunesday_double_feature(),
      line: m.text_topic_dunesday_verdict_double(),
    });
    expect(sideVerdict(50).side).toBe('double');
    expect(sideVerdict(57).side).toBe('double');
  });
});
