import { describe, expect, it } from 'vitest';
import { resolveJSONConflicts } from './resolve-i18n.ts';

describe('resolve-i18n', () => {
  it('should resolve conflicts in i18n messages at the middle', () => {
    const result = resolveJSONConflicts(`
      {
        "key": "value",
        "key2": "value2",
        <<<<<<< HEAD
        "key3": "value3",
        =======
        "key4": "value4",
        >>>>>>> branch
        "key5": "value5"
      }
      `);

    expect(result)
      .toEqual({
        key: 'value',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
        key5: 'value5',
      });
  });

  it('should resolve conflicts in i18n messages at the end', () => {
    const result = resolveJSONConflicts(`
      {
        "key": "value",
        "key2": "value2",
        <<<<<<< HEAD
        "key3": "value3",
        =======
        "key4": "value4",
        >>>>>>> branch
      }`);

    expect(result).toEqual({
      key: 'value',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
    });
  });

  it('should resolve conflicts in i18n messages at the start', () => {
    const result = resolveJSONConflicts(`
      {
        <<<<<<< HEAD
        "key3": "value3",
        =======
        "key4": "value4",
        >>>>>>> branch
        "key": "value",
        "key2": "value2"
      }`);

    expect(result).toEqual({
      key3: 'value3',
      key4: 'value4',
      key: 'value',
      key2: 'value2',
    });
  });

  it('should resolve conflicts with no conflicts', () => {
    const result = resolveJSONConflicts(`
      {
        "key": "value",
        "key2": "value2",
        "key3": "value3",
        "key4": "value4",
        "key5": "value5"
      }`);

    expect(result)
      .toEqual({
        key: 'value',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
        key5: 'value5',
      });
  });

  it('should resolve conflicts with empty object', () => {
    const result = resolveJSONConflicts('{}');

    expect(result).toEqual({});
  });

  it('should resolve conflicts with a lot of spaces', () => {
    const result = resolveJSONConflicts(`
      {
        "key":  "value",
        "key2": "value2"   ,
        <<<<<<< HEAD
        "key3":  "value3" ,
        =======
        "key4": "value4"   ,
        >>>>>>> branch
        "key5":     "value5"
      }`);

    expect(result)
      .toEqual({
        key: 'value',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
        key5: 'value5',
      });
  });

  it('should resolve conflicts with a lot of new lines', () => {
    const result = resolveJSONConflicts(`
      {
        "key": "value",
        "key2": "value2",



        
        <<<<<<< HEAD

        "key3": "value3",

        =======
        "key4": "value4",

        >>>>>>> branch
        "key5": "value5"
      }`);

    expect(result)
      .toEqual({
        key: 'value',
        key2: 'value2',
        key3: 'value3',
        key4: 'value4',
        key5: 'value5',
      });
  });
});
