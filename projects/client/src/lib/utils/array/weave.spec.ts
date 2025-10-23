import { describe, expect, it } from 'vitest';
import { weave } from './weave.ts';

describe('weave', () => {
  it('should weave two arrays of equal length', () => {
    const array1 = [1, 3, 5];
    const array2 = [2, 4, 6];
    const result = weave(array1, array2);
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should weave multiple arrays of equal length', () => {
    const array1 = ['a', 'd'];
    const array2 = ['b', 'e'];
    const array3 = ['c', 'f'];
    const result = weave(array1, array2, array3);
    expect(result).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
  });

  it('should handle arrays of different lengths', () => {
    const array1 = [1, 4, 7];
    const array2 = [2, 5];
    const array3 = [3, 6, 8, 9];
    const result = weave(array1, array2, array3);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('should handle single array', () => {
    const array = [1, 2, 3];
    const result = weave(array);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle empty arrays', () => {
    const array1: number[] = [];
    const array2: number[] = [];
    const result = weave(array1, array2);
    expect(result).toEqual([]);
  });

  it('should handle mix of empty and non-empty arrays', () => {
    const array1: number[] = [];
    const array2 = [1, 2, 3];
    const array3: number[] = [];
    const result = weave(array1, array2, array3);
    expect(result).toEqual([1, 2, 3]);
  });

  it('should handle no arrays provided', () => {
    const result = weave();
    expect(result).toEqual([]);
  });

  it('should handle arrays with falsy values correctly', () => {
    const array1 = [1, 0, 3];
    const array2 = [2, null, 4];
    const array3 = [undefined, '', 5];
    const result = weave(array1, array2, array3);

    expect(result).toEqual([1, 2, undefined, 0, null, '', 3, 4, 5]);
  });

  it('should handle arrays with boolean values', () => {
    const array1 = [true, false];
    const array2 = [false, true];
    const result = weave(array1, array2);

    expect(result).toEqual([true, false, false, true]);
  });

  it('should work with complex objects', () => {
    const array1 = [{ id: 1 }, { id: 3 }];
    const array2 = [{ id: 2 }, { id: 4 }];
    const result = weave(array1, array2);
    expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  });

  it('should not modify original arrays', () => {
    const array1 = [1, 3, 5];
    const array2 = [2, 4, 6];
    const original1 = [...array1];
    const original2 = [...array2];

    weave(array1, array2);

    expect(array1).toEqual(original1);
    expect(array2).toEqual(original2);
  });

  it('should handle strings as elements', () => {
    const array1 = ['apple', 'cherry'];
    const array2 = ['banana', 'date'];
    const result = weave(array1, array2);
    expect(result).toEqual(['apple', 'banana', 'cherry', 'date']);
  });
});
