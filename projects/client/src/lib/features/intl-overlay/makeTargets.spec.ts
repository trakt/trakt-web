import { describe, expect, it } from 'vitest';
import { makeTargets } from './makeTargets.ts';

type Entry = {
  id: number;
  show?: { id: number; title: string };
  title: string;
};

describe('util: makeTargets', () => {
  it('should skip selectors whose get returns null', () => {
    const targets = makeTargets<Entry>(
      {
        get: (e) =>
          'show' in e && e.show ? { id: e.show.id, type: 'show' } : null,
        patch: (e, title) =>
          'show' in e && e.show ? { ...e, show: { ...e.show, title } } : e,
      },
      {
        get: (e) => ({ id: e.id, type: 'movie' }),
        patch: (e, title) => ({ ...e, title }),
      },
    );

    const movieOnly = targets({ id: 1, title: 'EN' });
    expect(movieOnly).to.have.length(1);
    expect(movieOnly.at(0)?.type).to.equal('movie');

    const withShow = targets({
      id: 2,
      title: 'EN ep',
      show: { id: 99, title: 'EN show' },
    });
    expect(withShow.map((t) => t.type)).to.deep.equal(['show', 'movie']);
  });

  it('should expose the selector patch as the target apply', () => {
    const targets = makeTargets<Entry>({
      get: (e) => ({ id: e.id, type: 'movie' }),
      patch: (e, title) => ({ ...e, title }),
    });

    const [target] = targets({ id: 1, title: 'EN' });
    expect(target).toBeDefined();
    expect(target?.apply({ id: 1, title: 'EN' }, 'ES')).to.deep.equal({
      id: 1,
      title: 'ES',
    });
  });

  it('should return an empty array when no selector matches', () => {
    const targets = makeTargets<Entry>({
      get: () => null,
      patch: (e) => e,
    });

    expect(targets({ id: 1, title: 'EN' })).to.deep.equal([]);
  });
});
