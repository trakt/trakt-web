import { afterEach, describe, expect, it, vi } from 'vitest';
import { monitor } from './monitor';

describe('monitor', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should measure sync function execution time', () => {
    const mockLog = vi.fn();
    console.info = mockLog;

    const testFn = (x: number) => x * 2;
    const monitoredFn = monitor(testFn, 'testFn');

    const result = monitoredFn(2);

    expect(result).toBe(4);
    expect(mockLog).toHaveBeenCalledOnce();
    expect(mockLog.mock.lastCall).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/testFn took \d+(\.\d+)?ms/),
      ]),
    );
  });

  it('should measure async function execution time', async () => {
    const mockLog = vi.fn();
    console.info = mockLog;

    const testFn = async (x: number) => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return x * 2;
    };
    const monitoredFn = monitor(testFn, 'testFn');

    const result = await monitoredFn(2);

    expect(result).toBe(4);
    expect(mockLog).toHaveBeenCalledOnce();
    expect(mockLog.mock.lastCall).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/testFn took \d+(\.\d+)?ms/),
      ]),
    );
  });

  it('should preserve this context', () => {
    const mockLog = vi.fn();
    console.info = mockLog;

    const obj = {
      multiplier: 3,
      testFn(x: number) {
        return x * this.multiplier;
      },
    };

    obj.testFn = monitor(obj.testFn, 'testFn');

    const result = obj.testFn(2);

    expect(result).toBe(6);
    expect(mockLog).toHaveBeenCalledOnce();
  });

  it('should handle function with multiple arguments', () => {
    const mockLog = vi.fn();
    console.info = mockLog;

    const testFn = (x: number, y: number, z: number) => x * y * z;
    const monitoredFn = monitor(testFn, 'testFn');

    const result = monitoredFn(2, 3, 4);

    expect(result).toBe(24);
    expect(mockLog).toHaveBeenCalledOnce();
  });

  it('should handle async function rejection', async () => {
    const mockLog = vi.fn();
    console.info = mockLog;

    const testFn = () => Promise.reject(new Error('Test error'));
    const monitoredFn = monitor(testFn, 'testFn');

    await expect(monitoredFn()).rejects.toThrow('Test error');
    expect(mockLog).toHaveBeenCalledOnce();
    expect(mockLog.mock.lastCall).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/testFn took \d+(\.\d+)?ms/),
      ]),
    );
  });

  it('should preserve async function return type', async () => {
    const mockLog = vi.fn();
    console.info = mockLog;

    const testFn = (): Promise<string> => Promise.resolve('test');
    const monitoredFn = monitor(testFn, 'testFn');

    const result = await monitoredFn();

    expect(result).toBe('test');
    expect(mockLog).toHaveBeenCalledOnce();
  });
});
