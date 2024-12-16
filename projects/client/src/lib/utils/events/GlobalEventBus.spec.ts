import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GlobalEventBus } from './GlobalEventBus.ts';

describe('GlobalEventBus', () => {
  let eventBus: GlobalEventBus;

  beforeEach(() => {
    eventBus = GlobalEventBus.getInstance();
  });

  it('should return the same instance', () => {
    const instance1 = GlobalEventBus.getInstance();
    const instance2 = GlobalEventBus.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should register and trigger an event handler', () => {
    const handler = vi.fn();
    const eventType = 'click';

    const unregister = eventBus.register(eventType, handler);
    const event = new Event(eventType);
    globalThis.dispatchEvent(event);

    expect(handler).toHaveBeenCalledWith(event);
    unregister();
  });

  it('should unregister an event handler', () => {
    const handler = vi.fn();
    const eventType = 'click';

    const unregister = eventBus.register(eventType, handler);
    unregister();

    const event = new Event(eventType);
    globalThis.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should not trigger handler after unregistering', () => {
    const handler = vi.fn();
    const eventType = 'click';

    const unregister = eventBus.register(eventType, handler);
    unregister();

    const event = new Event(eventType);
    globalThis.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should handle multiple handlers for the same event', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const eventType = 'click';

    const unregister1 = eventBus.register(eventType, handler1);
    const unregister2 = eventBus.register(eventType, handler2);

    const event = new Event(eventType);
    globalThis.dispatchEvent(event);

    expect(handler1).toHaveBeenCalledWith(event);
    expect(handler2).toHaveBeenCalledWith(event);

    unregister1();
    unregister2();
  });

  it('should remove event listener when no handlers are registered', () => {
    const handler = vi.fn();
    const eventType = 'click';

    const unregister = eventBus.register(eventType, handler);
    const unregister2 = eventBus.register(eventType, vi.fn());
    const spy = vi.spyOn(globalThis, 'removeEventListener');
    unregister();
    expect(spy).not.toHaveBeenCalledWith(eventType, expect.any(Function));

    unregister2();
    expect(spy).toHaveBeenCalledWith(eventType, expect.any(Function));
    spy.mockRestore();
  });
});
