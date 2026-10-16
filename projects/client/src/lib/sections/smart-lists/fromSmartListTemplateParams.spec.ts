import { describe, expect, it } from 'vitest';
import { fromSmartListTemplateParams } from './fromSmartListTemplateParams.ts';
import { ListTarget } from './models/ListTarget.ts';

describe('util: fromSmartListTemplateParams', () => {
  it('should read the name and the source', () => {
    expect(
      fromSmartListTemplateParams(
        new URLSearchParams('name=Hidden+Gems&source=discover'),
      ),
    ).toEqual({ name: 'Hidden Gems', target: ListTarget.Discover });
  });

  it('should ignore an unknown source', () => {
    expect(
      fromSmartListTemplateParams(new URLSearchParams('source=nope')).target,
    ).toBeUndefined();
  });

  it('should ignore a blank name', () => {
    expect(
      fromSmartListTemplateParams(new URLSearchParams('name=+')).name,
    ).toBeUndefined();
  });

  it('should return nothing without params', () => {
    expect(fromSmartListTemplateParams(new URLSearchParams())).toEqual({
      name: undefined,
      target: undefined,
    });
  });
});
