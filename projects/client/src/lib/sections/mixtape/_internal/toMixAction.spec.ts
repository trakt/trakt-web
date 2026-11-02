import { describe, expect, it } from 'vitest';
import { parseMixtapeParams } from './parseMixtapeParams.ts';
import { toMixAction } from './toMixAction.ts';

const params = (search: string) =>
  parseMixtapeParams(new URLSearchParams(search));

describe('toMixAction', () => {
  it('should lead nowhere before the first pick', () => {
    const action = toMixAction({
      params: params('type=movie'),
      isMixing: false,
    });

    expect(action.state).toBe('empty');
    expect(action.href).toBeUndefined();
    expect(action.label).toBe('Mix it');
  });

  it('should lead to the results once something is picked', () => {
    const action = toMixAction({
      params: params('type=show&picks=1,2&source=navbar'),
      isMixing: false,
    });

    expect(action.state).toBe('picking');
    expect(action.href).toBe(
      '/discover/mixtape?type=show&picks=1%2C2&view=results&source=navbar',
    );
    expect(action.count).toBe(2);
  });

  it('should hold while mixing', () => {
    const action = toMixAction({
      params: params('type=movie&picks=1,2,3,4,5&view=results'),
      isMixing: true,
    });

    expect(action.state).toBe('mixing');
    expect(action.href).toBeUndefined();
    expect(action.label).toBe('Mixing');
  });

  it('should offer a remix back into the picker with the same picks', () => {
    const action = toMixAction({
      params: params('type=movie&picks=1,2,3&view=results'),
      isMixing: false,
    });

    expect(action.state).toBe('done');
    expect(action.href).toBe('/discover/mixtape?type=movie&picks=1%2C2%2C3');
    expect(action.label).toBe('Remix');
  });
});
